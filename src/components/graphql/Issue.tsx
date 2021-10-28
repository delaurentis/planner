import React, { useState } from 'react';
import { primaryLabelForIssue, 
         officialLabelNames, 
         labelNamesForIssue } from 'data/labels';
import { actionsForPrimaryLabel } from 'data/actions';
import { titleForUsername } from 'data/teams';
import { Issue as IssueType, 
         Label as LabelType,
         Action as ActionType,
         Epic as EpicType, 
         Milestone as MilestoneType,
         Team } from 'data/types';
import Listing from 'components/presentation/Listing';
import Chip from 'components/presentation/Chip';
import IssueEpic from './IssueEpic';
import IssueAssignee from './IssueAssignee';
import IssueMilestone from './IssueMilestone';
import IssueEnvironment from './IssueEnvironment';
import IssueResolution from './IssueResolution';
import IssueSchedule from './IssueSchedule';
import { useApolloClient } from '@apollo/client';
import { ISSUE_WITH_EPIC_FRAGMENT } from 'data/queries';
import { environmentFromLabelNames } from 'data/environments';
import { resolutionsFromLabelNames } from 'data/resolutions';

interface IssueProps {
  issue?: IssueType;
  isEditing?: boolean;
  extraColumn?: string;
  milestone?: MilestoneType,
  milestones?: MilestoneType[],
  epics?: EpicType[];
  team?: Team;
  defaultCategory?: string;
  onUpdateIssue?(update: any, issue?: IssueType): void;
}

const Issue: React.FC<IssueProps> = (props) => {

  // To do this, we link them directly to the fragment in the cache
  // This feels kludgy and wrong and is likely due to lack of knowledge on my part
  // So far, it's the only way I can get the items to update optimistically
  const client = useApolloClient();
  const issue: IssueType = client.readFragment({id: `Issue:${props.issue?.id}`, 
                                                fragment: ISSUE_WITH_EPIC_FRAGMENT,
                                                fragmentName: 'issueWithEpicResult'}) || {};
    
  // Get all label names, and extract some info from them
  const labelNames: string[] = labelNamesForIssue(issue);
  const resolutions = resolutionsFromLabelNames(labelNames);
  const isBug = labelNames.includes(officialLabelNames.bug);

  // Our primary label dictates what icon we show and what actions we allow when they click it
  const primaryLabel: LabelType = primaryLabelForIssue(issue);
  const possibleActions: ActionType[] = actionsForPrimaryLabel(primaryLabel);

  // Create our label objects which will become clickable URLs
  const labels: LabelType[] = labelNames.map((name: string) => {
    return { name, url: `https://gitlab.companyname.com/groups/team/-/issues?label_name=${name}` };
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
    if ( isBug ) {
      if ( needsResolution ) {
        return 'What changes did the fix involve?';
      }
      else {
        const doesTitleAlreadyContainBugIcon = issue.title?.charAt(0) === '🐞';
        if ( !doesTitleAlreadyContainBugIcon ) {
          return `🐞 ${issue.title}`;
        }
      }
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

  // Handle update of existing issue, or creation of new one
  const handleUpdate = (update: any, entity: any) => {
    props.onUpdateIssue?.(update, entity);

    // If the issue was closed, prompt for resolution
    if ( isBug && update?.state_event === 'close' && resolutions.length === 0) {
      setNeedsResolution(true);
    }
  }

  // Figure out what goes in the right column
  const extra = (): React.ReactNode | undefined => {
    if ( isBug && (needsResolution || props.extraColumn === 'Resolution') ) {
      return <IssueResolution issue={issue} 
                              resolutions={resolutions} 
                              onUpdate={(update) => handleUpdate(update, issue)}
                              onClosePrompt={() => setNeedsResolution(false)}
                              isPrompt={needsResolution}/>
    }
    else if ( isBug && props.extraColumn === 'Environment' ) {
      return <IssueEnvironment issue={issue} 
                               environment={environmentFromLabelNames(labelNames)} 
                               onUpdate={(update) => handleUpdate(update, issue)}
                               isPrompt={false}/>
    }
    else if ( props.extraColumn === 'Epic' ) {
      return <IssueEpic issue={issue} 
                        epics={props.epics} 
                        onUpdating={setUpdating}/>
    }
    else if ( props.extraColumn === 'Assignee' ) {
      return <IssueAssignee issue={issue} 
                            team={props.team}
                            onUpdating={setUpdating}/>
    }
    else if ( props.extraColumn === 'Sprint' ) {
      return <IssueMilestone issue={issue} 
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
    }
    else if ( props.extraColumn === 'Author' ) {
      return <Chip size='small' url={`https://gitlab.companyname.com/groups/team/-/issues?author_username=${issue.author?.username}`}>
              <span>{titleForUsername(issue.author?.username)}</span>
             </Chip>;
    }
    else if ( props.extraColumn === 'Days' ) {

      // The schedule adds and removes labels under the hood,
      // and uses the same functionality as the actions in the popup menu
      // It's a slightly different beast than the other typeahead entries above
      // which use different API calls to update GitLab
      return <IssueSchedule issue={issue} onUpdate={(update) => handleUpdate(update, issue)}/>
    }
    return undefined;
  }

  return (
    <div>
      <Listing icon={displayIcon()}
            title={displayTitle()}
            url={issue.webUrl}
            entity={issue}
            placeholder='New Issue'
            actions={possibleActions}
            labels={props.extraColumn === 'Labels' ? visibleLabels : undefined}
            extra={extra()}
            isNew={isNew} 
            defaultCategory={props.defaultCategory}
            isEditing={props.isEditing}
            isHighlighted={(primaryLabel.name === 'Doing')}
            onUpdate={handleUpdate}/>
    </div>
  );
}

export default Issue;
