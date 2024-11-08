import React, { useState, useRef, useEffect } from 'react';
import { primaryLabelForIssue, 
         officialLabelNames, 
         labelNamesForIssue,
         orderingForIssue } from 'data/labels';
import { actionsForPrimaryLabel } from 'data/actions';
import { Issue as IssueType, 
         Label as LabelType,
         Action as ActionType,
         Epic as EpicType, 
         Milestone as MilestoneType,
         MilestoneLibrary,
         Team } from 'data/types';
import Listing from 'components/presentation/Listing';
import Chip from 'components/presentation/Chip';
import IconStats from 'components/presentation/IconStats';
import IssueEpic from './IssueEpic';
import IssueAuthor from './IssueAuthor';
import IssueAssignee from './IssueAssignee';
import IssueMilestone from './IssueMilestone';
import IssueEnvironment from './IssueEnvironment';
import IssueResolution from './IssueResolution';
import IssueFlags from './IssueFlags';
import IssueEstimate from './IssueEstimate';
import IssueTimeSpent from './IssueTimeSpent';
import IssueDeadline from './IssueDeadline';
import IssueProject from './IssueProject';
import IssueSchedule from './IssueSchedule';
import { useApolloClient, useQuery } from '@apollo/client';
import { ISSUE_WITH_EPIC_FRAGMENT, SELECTED_ISSUE } from 'data/queries';
import { environmentFromLabelNames } from 'data/environments';
import { resolutionsFromLabelNames } from 'data/resolutions';
import { flagsFromLabelNames } from 'data/flags';
import { organization } from 'data/customize';
import { BooleanValueNode } from 'graphql';

interface IssueProps {
  issue?: IssueType;
  isCreating?: boolean;
  isEditing?: boolean;
  isShowingActions?: boolean;
  isShowingActionShortcuts?: boolean;
  extraColumn?: string;
  milestone?: MilestoneType,
  milestones: MilestoneLibrary,
  epics?: EpicType[];
  team?: Team;
  filterUsername?: string;
  defaultCategory?: string;
  stats?: any[];
  disableShortcuts?: boolean;
  focusRequestedAt?: number;
  onUpdateIssue?(update: any, issue?: IssueType): void;
  onEditingIssue?(editing: boolean, issue?: IssueType): void;
  onShowActions?(isShowing: boolean, isUsingKeyboard: boolean, issue?: IssueType): void;
  onNeedsKeyboard?(isNeeded: boolean): void;
  onKey?(key: string): boolean;
}

const Issue: React.FC<IssueProps> = (props) => {

  // To do this, we link them directly to the fragment in the cache
  // This feels kludgy and wrong and is likely due to lack of knowledge on my part
  // So far, it's the only way I can get the items to update optimistically
  const client = useApolloClient();
  const issue: IssueType = client.readFragment({id: `Issue:${props.issue?.id}`, 
                                                fragment: ISSUE_WITH_EPIC_FRAGMENT,
                                                fragmentName: 'issueWithEpicResult'}) || {};

  // Make sure we can disable shortcuts in a way that our handleKey method can recognize
  // even though it's getting called with an older version of props
  const disableShortcutsRef = useRef<boolean>(false);
  useEffect(() => {
    disableShortcutsRef.current = props.disableShortcuts || false;
  }, [props.disableShortcuts]);

  // Allow focus to be requested internally or externally
  const [focusRequestedAt, setFocusRequestedAt] = useState(props.focusRequestedAt);
  useEffect(() => {
    setFocusRequestedAt(props.focusRequestedAt);
  }, [props.focusRequestedAt]);

  // Get all label names, and extract some info from them
  const labelNames: string[] = labelNamesForIssue(issue);
  const resolutions = resolutionsFromLabelNames(labelNames);
  const isBug = labelNames.includes(officialLabelNames.bug);

  // Our primary label dictates what icon we show and what actions we allow when they click it
  const primaryLabel: LabelType = primaryLabelForIssue(issue);
  const possibleActions: ActionType[] = actionsForPrimaryLabel(primaryLabel);

  // Create our label objects which will become clickable URLs
  const labels: LabelType[] = labelNames.map((name: string) => {
    return { name, url: `https://gitlab.com/groups/${organization}/-/issues?label_name=${name}` };
  });

  // Filter out the day labels from what we display, and extract them into their own lisrt
  const visibleLabels = labels.filter(label => !label?.name?.includes('📅'));
  const dayLabelNames = labelNames.filter(label => label.includes('📅'));
  
  // The icon we display might change based on prompts
  const displayIcon = (): string => {
    if ( needsResolution ) {
      return '❓';
    }
    else {
      return primaryLabel.icon || '';
    }
  }

  // The title we display might include an extra icon for bugs
  const displayTitle = (): string => {
    const icons: string[] = [];
    if ( isBug ) {
      if ( needsResolution ) {
        return 'What changes did the fix involve?';
      }
      else {
        const doesTitleAlreadyContainBugIcon = issue.title?.charAt(0) === '🐞';
        if ( !doesTitleAlreadyContainBugIcon ) {
          icons.push('🐞');
        }
      }
    }
    if ( issue.dueDate ) {
      icons.push('📆');
    }
    if ( icons.length > 0 && issue.title) {
      return `${icons.join('')} ${issue.title}`;
    }
    return issue.title || "";
  }

  // See how fresh the issue is
  const msSinceCreation = new Date().getTime() - (issue.createdAt && new Date(issue.createdAt).getTime());
  // const msSinceUpdate = new Date().getTime() - (issue.updatedAt && new Date(issue.updatedAt).getTime());
  const isNew = (msSinceCreation < 10000); // || (msSinceUpdate < 20000);

  // This is used to trigger us to redraw of this component by some callbacks
  const [, setUpdating] = useState(false);

  // Ask the user for more info if they open or close a bug
  const [needsResolution, setNeedsResolution] = useState(false);

  // When the issue is created, trigger a prompt to ask for enviromment
  /*
  useEffect(() => {
    if ( msSinceCreation < 10000 && !needsEnvironment && !environment ) {
      setNeedsEnvironment(true);
    }
  }, [props.issue]);
  */

  // When clicked, mark the issue as selected
  // We store it in Apollo so that other components can access it
  const selectedQuery = useQuery(SELECTED_ISSUE);
  const selectedIssueId = selectedQuery.data?.selectedIssueId;
  const handleIssueClick = () => {
    if ( selectedIssueId !== issue.id ) {
      client.writeQuery({ query: SELECTED_ISSUE, data: { selectedIssueId: issue?.id } });
    }
    else {
      client.writeQuery({ query: SELECTED_ISSUE, data: { selectedIssueId: null } });
    }
  }

  // Handle adjustments to editing state
  const handleEditing = (editing: boolean) => {
    props.onEditingIssue?.(editing, issue);
  }

  // Handle update of existing issue, or creation of new one
  const handleUpdate = (update: any, entity: any) => {

    // If we're being asked to edit then request edit mode
    // and wait to focus for a beat to avoid the keystroke that 
    // triggered edit mode from being captured by the input
    if ( update.isEditingTitle ) {
      props.onEditingIssue?.(true, issue);
      setTimeout(() => { setFocusRequestedAt(new Date().getTime()) }, 100);
    }
    else if ( update.isOpeningIssueLink ) {
      window.open(`https://gitlab.com${issue.webPath}`);
    }
    else {
      // Ask our callback to update the issue now
      props.onUpdateIssue?.(update, entity);

      // If the issue was closed, prompt for resolution
      if ( isBug && update?.state_event === 'close' && resolutions.length === 0) {
        setNeedsResolution(true);
      }
    }

    // Clear the actions menu
    props.onShowActions?.(false, false, issue);
  }

  // Handle a key 
  const handleKey = (key: string, entity: any): boolean => {

    // If shortcuts are disabled don't do anything
    // This is used when the user is typing a new issue title
    // and we don't want to trigger any shortcuts 
    // if their mouse moves over another listing
    if ( disableShortcutsRef.current === true ) {
      return true;
    }

    // Get the latest issue direct from Apollo, since this called
    // from a place that freezes the React component's props
    // internal variables and they will be old when this method is called
    const latestIssue: IssueType = client.readFragment(
      {id: `Issue:${entity.id}`, 
      fragment: ISSUE_WITH_EPIC_FRAGMENT,
      fragmentName: 'issueWithEpicResult'}) || {};

    // Lookup all actions for the given issue
    const actions: ActionType[] = actionsForPrimaryLabel(primaryLabelForIssue(latestIssue));
    const actionWithShortcut: ActionType | undefined = actions.find(action => action.shortcut === key);
    if ( actionWithShortcut ) {

      // Some actions may require confirmation
      if ( actionWithShortcut.isConfirmable ) {
        if ( !window.confirm(`${actionWithShortcut.confirmMessage}:\n'${issue.title}'`) ) {
          
          // Bail before doing anything 
          // if the user cancels the action
          return true;
        }
      } 

      // Continue on and update the issue
      handleUpdate(actionWithShortcut.update, latestIssue);
      return true;
    }
    else if ( key === 'a' ) {
      // Toggle showing the actions strip
      // and if we get there with the keyboard shortcut
      // then show other keyboard shortcuts
      if ( !props.isShowingActions ) { 
        props.onShowActions?.(true, true, issue);
      }
      else {
        props.onShowActions?.(false, true, issue);
      }
      return true;
    }
    else if ( key === 'Escape' && props.isShowingActions ) {
      props.onShowActions?.(false, true, issue);
      return true;
    }

    // No keys matched so use default handling in the Card, and then in the Listing
    return props.onKey?.(key) || false;
  }

  // Figure out what goes in the right column
  const extras = (): React.ReactNode[] | undefined => {
    if ( props.stats ) {
      return [<IconStats stats={props.stats}/>];
    }
    else if ( isBug && (needsResolution || props.extraColumn === 'Resolution') ) {
      return [<IssueResolution issue={issue} 
                              resolutions={resolutions} 
                              onUpdate={(update) => handleUpdate(update, issue)}
                              onClosePrompt={() => setNeedsResolution(false)}
                              isPrompt={needsResolution}/>]
    }
    else if ( isBug && props.extraColumn === 'Environment' ) {
      return [<IssueEnvironment issue={issue} 
                               environment={environmentFromLabelNames(labelNames)} 
                               onUpdate={(update) => handleUpdate(update, issue)}
                               isPrompt={false}/>]
    }
    else if ( props.extraColumn === 'Settings' ) {
      return [<IssueFlags issue={issue} 
                          flags={flagsFromLabelNames(labelNames)}
                          categories={['Settings']}
                          isIconOnly={false}
                          onUpdate={(update) => handleUpdate(update, issue)}/>]
    }
    else if ( props.extraColumn === 'Surprises' ) {
      return [<IssueFlags issue={issue} 
                          flags={flagsFromLabelNames(labelNames)}
                          categories={['Surprises']}
                          isIconOnly={false}
                          onUpdate={(update) => handleUpdate(update, issue)}/>,
              <IssueEstimate issue={issue} onUpdate={(update) => handleUpdate(update, issue)}/>]
    }
    else if ( props.extraColumn === 'Details' ) {
      return [<IssueFlags issue={issue} 
                          flags={flagsFromLabelNames(labelNames)}
                          categories={['Details']}
                          isIconOnly={false}
                          onUpdate={(update) => handleUpdate(update, issue)}/>]
    }
    else if ( props.extraColumn === 'Epic' ) {
      return [<IssueEpic issue={issue} 
                         epics={props.epics} 
                         onUpdating={setUpdating}/>]
    }
    else if ( props.extraColumn === 'People' ) {
      return [<IssueAuthor issue={issue} team={props.team}/>,
              <IssueAssignee issue={issue} team={props.team} onUpdating={setUpdating}/>
            ]
    }
    else if ( props.extraColumn === 'Sprint' ) {
      return [<IssueMilestone issue={issue} 
                              milestone={issue.milestone}
                              milestones={props.milestones}
                              onUpdating={(isUpdating) => {

                                // Note that we're updating
                                setUpdating(isUpdating); 

                                // If we're making a change, remove all day labels
                                if ( isUpdating ) {
                                  handleUpdate({remove_labels: dayLabelNames.join(',')}, issue);
                                }
                             }}/>
             ]
    }
    else if ( props.extraColumn === 'Project' ) {
      return [<IssueProject issue={issue} onUpdating={setUpdating}/>]
    } 
    else if ( props.extraColumn === 'Deadline' ) {
      return [<IssueDeadline issue={issue} onUpdate={(update) => handleUpdate(update, issue)}/>]
    }
    else if ( props.extraColumn === 'Estimate' ) {
      return [<IssueEstimate issue={issue} onUpdate={(update) => handleUpdate(update, issue)}/>]
    }
    else if ( props.extraColumn === 'Schedule' ) {

      // The schedule adds and removes labels under the hood,
      // and uses the same functionality as the actions in the popup menu
      // It's a slightly different beast than the other typeahead entries above
      // which use different API calls to update GitLab
      return [<IssueAssignee issue={issue} team={props.team} onUpdating={setUpdating} useAvatar={true} filterUsername={props.filterUsername}/>,
              <IssueSchedule issue={issue} onUpdate={(update) => handleUpdate(update, issue)}/>, 
              <IssueEstimate issue={issue} onUpdate={(update) => handleUpdate(update, issue)}/>,
              <IssueTimeSpent issue={issue} onUpdate={(update) => handleUpdate(update, issue)}/>]
    }
    else if ( props.extraColumn === 'Ordering' ) {
      return [<Chip size='small' isCenteredVertically={true}><span>{orderingForIssue(issue)}</span></Chip>]
    }
    return undefined;
  }

  // The far right column always holds an estimate
  const estimate = <IssueEstimate issue={issue} onUpdate={(update) => handleUpdate(update, issue)}/>;

  return (
    <div>
      <Listing 
            key={issue.id}
            icon={displayIcon()}
            title={displayTitle()}
            entity={issue}
            placeholder={ props.isCreating ? 'New Issue' : 'Untitled Issue' }
            actions={possibleActions}
            labels={props.extraColumn === 'Labels' ? visibleLabels : undefined}
            extras={extras()}
            isNew={isNew} 
            isSelected={issue?.id ? issue?.id === selectedIssueId : false}
            defaultCategory={props.defaultCategory} 
            isEditing={props.isCreating || props.isEditing}
            isCreating={props.isCreating}
            isHighlighted={(primaryLabel.name === 'Doing')}
            onUpdate={handleUpdate}
            onKey={handleKey}
            focusRequestedAt={focusRequestedAt}
            isShowingActions={props.isShowingActions}
            isShowingActionShortcuts={props.isShowingActionShortcuts}
            onShowActions={(show) => { props.onShowActions?.(show, false, issue) }}
            onEditing={(editing: boolean) => { handleEditing(editing)}}
            onFocus={() => props.onNeedsKeyboard?.(true)}
            onBlur={() => props.onNeedsKeyboard?.(false)}
            onClick={() => { handleIssueClick() }}/>
    </div>
  );
}

export default Issue;
