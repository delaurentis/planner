import React, { useState, useEffect, useRef } from 'react';
import Issue from './Issue';
import Card from '../presentation/Card';
import { Epic, Option, OptionChoice, Team, Issue as IssueType, MilestoneLibrary } from 'data/types';
import { extraColumns } from 'data/extras';
import { polling } from 'data/polling';
import { projects } from 'data/projects';
import { organization } from 'data/customize';
import { humanizeDateRange } from 'util/dates';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { ALL_ISSUES, 
         OPEN_ISSUES_NO_MILESTONE,
         OPEN_UNASSIGNED_ISSUES,
         OPEN_UNASSIGNED_ISSUES_NO_MILESTONE,
         ALL_BUG_ISSUES, 
         UPDATE_ISSUE, 
         CREATE_ISSUE,
         DELETE_ISSUE, 
         ESTIMATE_ISSUE,
         UNESTIMATE_ISSUE,
         CLOCK_ISSUE,
         UNCLOCK_ISSUE,
         USER,
         EXTRA_COLUMN,
         SELECTED_ISSUE } from 'data/queries';
import { CATEGORY_FEATURE, CATEGORY_BUG } from 'data/categories';
import { labelNameFromEnvironment } from 'data/environments';
import { orderingForIssue } from 'data/labels';
import { priorityStatsFromIssues, hourlyStatsFromIssues, countStatsFromIssues } from 'data/stats';
import { durableOrder, DurableOrderSnapshot } from 'util/durableOrder';

interface UserIssuesProps {
  username: string;
  milestone?: any;
  milestones: MilestoneLibrary;
  showClosed: boolean;
  labels?: string[];
  project?: string;
  team?: Team;
  epics?: Epic[];
  isHiddenWhenEmpty?: boolean;
}

const UserIssues: React.FC<UserIssuesProps> = (props: UserIssuesProps) => {

  // Keep a copy of the order of issues in the local state
  // That way we can prevent things from getting sorted as we click around
  // (We use a ref because we don't want to trigger updates when we update this)
  const orderingsRef = useRef<DurableOrderSnapshot>({});
  
  // Allow for us to reset the ordering
  // (this is used to force a re-render b/c the value changes)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [orderingRequestedAt, setOrderingRequestedAt] = React.useState(new Date().getTime());
  const handleResetOrdering = () => {
    // Do this here instead of in the useEffect below
    // because it makes it re-sort with 1 keystroke instead of 2
    orderingsRef.current = {}
    setOrderingRequestedAt(new Date().getTime())
  }

  // Reset the order when we switch users, because we'll get different issues
  useEffect(() => { orderingsRef.current = {}; }, [props.username, props.labels, props.milestone])

  // The card has a setting that controls what we show on the right column
  // We'll store that setting globally for all cards
  const client = useApolloClient();
  const extraQuery = useQuery(EXTRA_COLUMN);
  const handleExtra = (option: Option, choice: OptionChoice) => {
    client.writeQuery({ query: EXTRA_COLUMN, data: { extraColumn: choice.title } });
    window.localStorage.setItem('extraColumn', choice.title);
  }

  // Get our user, because we need their ID to create issues
  const userQuery = useQuery(USER, { variables: { username: props.username } });
  const optionalAssignee = props.username === 'none' || props.username === 'fixes' ? {} : { assignee_id: userQuery.data?.user[0]?.id  };
  
  // Figure out our variables for the query
  const variables = () => {
    if ( props.username === 'none' ) {

      // If there is no user, we need to use team labels to filter down the unassigned issues
      return { 
        username: 'none', 
        milestones: [props.milestone.title],  
        labels: props.labels,
        fullPath: organization, // for Requests tab return all issues in the organization
      };
    }
    else if ( props.username === 'fixes' ) {
      return { 
        milestones: [props.milestone.title], 
        labels: [...props.labels || [], '🐞 Bug'],
        fullPath: organization, // for Fixes tab return all issues in the organization
      };
    }
    else {
      return { 
        username: props.username, 
        milestones: [props.milestone.title],
        path: props.project,
        fullPath: organization, // for users return all issues in the organization
       };
    }
  }
  
  const gqlForIssues = () => {
    if ( props.username === 'none' ) {
      if ( props.milestone.title === 'none' ) { 
        return OPEN_UNASSIGNED_ISSUES_NO_MILESTONE;
      }
      else {
        return OPEN_UNASSIGNED_ISSUES;
      }
    }
    else if ( props.username === 'fixes' ) {
      return ALL_BUG_ISSUES;
    }
    else {
      if ( props.milestone.title === 'none' ) { 
        return OPEN_ISSUES_NO_MILESTONE;
      }
      else {
        return ALL_ISSUES;
      }
    }
  }
  
  // Load open AND closed issues from cache, then API, and then refresh every second
  const issuesQuery = useQuery(gqlForIssues(), { variables: variables() }) || {};

  // Poll for changes to open issues 
  // (fix for bug in Apollo that doesn't stop polling when you navigate away)
  const startPolling = issuesQuery.startPolling;
  const stopPolling = issuesQuery.stopPolling;
  useEffect(() => {
    startPolling(polling.frequency.allIssue);
    return () => {
      stopPolling();
    }
  }, [startPolling, stopPolling])

  // Extract our issues from the data returned
  const issueNodes = issuesQuery.data?.group?.issues?.nodes || issuesQuery.data?.project?.issues?.nodes || [];

  // Get the IDs of all of our projects
  const projectIds: number[] =  Object.values(projects)
  const projectIssueNodes = issueNodes.filter(node => projectIds.includes((node as any).projectId))

  // Get any epics associated with these issues
  // ...

  // Refetch right away after any mutations
  const refetchQueries = [
    { query: gqlForIssues(), variables: variables() },
  ];

  // The user tried to update an issue
  const [updateIssue] = useMutation(UPDATE_ISSUE, { refetchQueries });
  const [createIssue] = useMutation(CREATE_ISSUE, { refetchQueries });
  const [deleteIssue] = useMutation(DELETE_ISSUE, { refetchQueries });
  const [estimateIssue] = useMutation(ESTIMATE_ISSUE, { refetchQueries });
  const [unestimateIssue] = useMutation(UNESTIMATE_ISSUE, { refetchQueries });
  const [clockIssue] = useMutation(CLOCK_ISSUE, { refetchQueries });
  const [unclockIssue] = useMutation(UNCLOCK_ISSUE, { refetchQueries });
  const handleUpdateIssue = (update: any, issue: any) => {
  
    // We will re-fetch the query from apollo after any mutations
    // Temporarily turn off polling since they can conflict and cause the screen to flash white
    stopPolling();

    // Are we modifying an existing issue, or creating a new one?
    if ( issue ) {  

      // Get the project name for this issue and figure out the ID
      const beforeDash: string = issue.webPath?.split('/-')[0];
      const issueProjectName: string = beforeDash?.split('/')?.slice(2)?.join('/');
      const issueProjectId = projects[issueProjectName];

      // Delete the issue if that's been requested
      if ( update.delete ) {
        deleteIssue({ variables: { projectId: issueProjectId, id: issue.iid }});
      }
      else if ( update.estimateChanged ) {
        if ( update.estimate ) {
          try {
            estimateIssue({ variables: { projectId: issueProjectId, id: issue.iid, input: { duration: update.estimate } }});
          }
          catch(error) {}
        }
        else {
          unestimateIssue({ variables: { projectId: issueProjectId, id: issue.iid, input: {} }});
        }
      }
      else if ( update.timeSpentChanged ) {
        if ( update.timeSpent ) {
          // Need to reset the timer first before adding more time
          (async () => {
            try {
              await unclockIssue({ variables: { projectId: issueProjectId, id: issue.iid, input: {} }});
              await clockIssue({ variables: { projectId: issueProjectId, id: issue.iid, input: { duration: update.timeSpent } }});
            }
            catch(error) {}
          })();
        }
        else {
          unclockIssue({ variables: { projectId: issueProjectId, id: issue.iid, input: {} }});
        }
      }
      else {
        // Now update the issue within the right project!
        updateIssue({ variables: { projectId: issueProjectId, id: issue.iid, input: update }});
      }
    }
    else {

      // Remove any metadata we use internally from the update
      const { meta, ...updateWithoutMeta } = update;
      const categoryLabels = meta.category === '🐞 Bug' ? ['🐞 Bug'] : [];
      const environmentLabels = meta.environment ? [labelNameFromEnvironment(meta.environment)] : [];

      // When we add issues to someone, we check what project they are a part of
      // This is because some teams, like ops are on different projects
      const userProjectId = projects[props.project || 'reponame'];

      // Take any labels that are special for a user and then add the standard ones
      const labelsForTeam = props.labels || [];
      const standardLabels: string[] = (props.username === 'none' || props.username === 'fixes') ? ['Triage 🛎'] : ['P2 🙏'];
      const standardAndCustomLabels: string[] = labelsForTeam.concat(standardLabels);

      // Are there any labels based on the text detected in the issue title?
      const titleGeneratedLabels = update.title?.toUpperCase().indexOf('OOO') >= 0 ? ['OOO 🌴'] : [];

      // Combine all the labels together and de-dupe them
      const allLabels: string[] = standardAndCustomLabels.concat(categoryLabels).concat(environmentLabels).concat(titleGeneratedLabels);
      const uniqueLabels = [...new Set(allLabels)];

      createIssue({ variables: 
        { projectId: userProjectId, 
          input: {...updateWithoutMeta, 
                  ...optionalAssignee,
                  milestone_id: parseInt(props.milestone.id),
                  labels: uniqueLabels.join(',') }}});
    }

    // Revert to slower timeouts after N seconds
    setTimeout(() => { 
      startPolling(polling.frequency.allIssue);
    }, polling.period.changedIssue);
  }

  // Figure out title and where it goes if you click iot
  const milestoneTitleForGitLab = props.milestone.title === 'none' ? 'None' : props.milestone.title
  const userUrl: string = `https://gitlab.com/${organization}/${props.project}/-/issues?scope=all&utf8=%E2%9C%93&assignee_username[]=${props.username}&milestone_title=${milestoneTitleForGitLab}`

  // Keep track of which issue we're editing (only allow 1 at a time)
  const [editingIssueId, setEditingIssueId] = useState<number | null>(null);
  const handleEditingIssue = (editing: boolean, issue: IssueType) => {
    if ( editing ) {
      setEditingIssueId((issue && issue.iid) || null);
    }
    else {
      setEditingIssueId(null);
    }
  }

  // Keep track of which issue, if any has the action strips showing
  const [actionIssueId, setActionIssueId] = useState<number | null>(null);
  const [isShowingActionShortcuts, setShowingActionShortcuts] = useState<boolean>(false);
  const handleShowActions = (isShowing: boolean, isUsingKeyboard: boolean, issue: IssueType) => {
    if ( isShowing ) {
      setActionIssueId((issue && issue.iid) || null);
      setShowingActionShortcuts(isUsingKeyboard);
    }
    else {
      setActionIssueId(null);
    }
  }

  // Determine if we've set orderings before... only happens once data gets loaded the first time
  const { sortedItems, orderingSnapshot } = durableOrder(projectIssueNodes, orderingForIssue, orderingsRef.current);
  orderingsRef.current = orderingSnapshot;
  
  const issuesToShow = () => sortedItems.map((issue: any) => 
    <Issue key={issue.id} 
           issue={issue} 
           epics={props.epics} 
           team={props.team}
           milestone={props.milestone}
           milestones={props.milestones}
           extraColumn={extraQuery.data?.extraColumn} 
           disableShortcuts={disableShortcuts || editingIssueId !== null}
           onUpdateIssue={handleUpdateIssue} 
           onEditingIssue={handleEditingIssue}
           onShowActions={(handleShowActions)}
           isEditing={editingIssueId === issue.iid}
           isShowingActions={actionIssueId === issue.iid}
           isShowingActionShortcuts={actionIssueId === issue.iid && isShowingActionShortcuts}
           onKey={handleKeyOnIssue} 
    />
  );

  // Controls what we show in the right column
  const cardOption: Option = {
    title: extraQuery.data?.extraColumn,
    name: extraQuery.data?.extraColumn,
    isSelected: false,
    isSelectable: false,
    isExpandable: true,
    choices: extraColumns,
    onSelectOption: handleExtra,
    tip: 'Press v or click to change the view'
  };

  // When we're creating a new issue, that means we should disable shortcuts
  const [disableShortcuts, setDisableShortcuts] = useState(false);
  const handleNeedsKeyboard = (isNeeded: boolean) => { setDisableShortcuts(isNeeded); }

  // Be able to focus on a new issue when needed
  const [focusRequestedAt, setFocusRequestedAt] = useState<number | undefined>();
  
  // Support up and down arrows to move between issues
  const selectedQuery = useQuery(SELECTED_ISSUE);
  const selectedIssueId = selectedQuery.data?.selectedIssueId;
  const handleKeyOnIssue = (key: string): boolean => {
    if ( key === 'ArrowDown' || key === 'ArrowUp' ) {

      // If it's an arrow key, lets find out where in the list our current selected issue is
      const currentIndex = sortedItems.findIndex((issue: any) => issue.id === selectedIssueId);
      if ( currentIndex >= 0 ) {
        const targetIndex = Math.min(Math.max(key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1, 0), sortedItems.length - 1);
        const targetIssue: IssueType = sortedItems[targetIndex];
        if ( targetIssue && targetIssue?.id !== selectedIssueId ) {
          client.writeQuery({ query: SELECTED_ISSUE, data: { selectedIssueId: targetIssue?.id } });
        }
      }
      return true;
    }
    return false;
  }

  // Handle a key press on the card
  const handleKeyOnCard = (key: string): boolean => {
    if ( disableShortcuts || editingIssueId !== null ) { return true; }
    if ( key === 'n' || key === '/' ) {
      setFocusRequestedAt(new Date().getTime());
    }
    else if ( key === 's' ) {
      handleResetOrdering();
    } 
    else if ( key === 'v' || key === 'V' ) {

      // Move to the next or previous view
      const index = extraColumns.findIndex((column: any) => column.title === extraQuery.data?.extraColumn);
      const isGoingForward = key === 'v';
      const nextIndex = (index + (isGoingForward ? 1 : -1)) % extraColumns.length;
      const protectedNextIndex = nextIndex < 0 ? extraColumns.length + nextIndex : nextIndex;
      const nextExtra = extraColumns[protectedNextIndex].title;

      // Update apollo so the UI updates + store it in local storage 
      // so it persists across reloads of the page
      client.writeQuery({ query: EXTRA_COLUMN, data: { extraColumn: nextExtra } });
      window.localStorage.setItem('extraColumn', nextExtra);
    }
    else {
      return false;
    }
    return true;
  }

  // Adjust the milestone title
  const milestoneTitle = props.milestone.title === 'none' ? 'Triage' : props.milestone.title; 

  // An optional subtitle for the milestone
  const milestoneSubtitle = () => {
    if ( props.milestone.startDate && props.milestone.dueDate ) {
      return humanizeDateRange(props.milestone.startDate, props.milestone.dueDate);
    }
    return undefined;
  }

  // Show the right stats based on the last column type
  const stats = () => {
    const extraColumn = extraQuery.data?.extraColumn;
    if ( extraColumn === 'Schedule' || extraColumn === 'Estimate' ) {
      return priorityStatsFromIssues(sortedItems);
    }
    else if ( extraColumn === 'Surprises' ) {
      return hourlyStatsFromIssues(sortedItems, ['🐞', '👻']);
    }
    else if ( extraColumn === 'Details' ) {
      return countStatsFromIssues(sortedItems, ['📝', '🕵🏻']);
    }
    return undefined;
  }
  
  // Don't show anything if we're supposed to hide it if empty
  const openIssueNodes = sortedItems.filter(node => (node as any).state !== 'closed');
  if ( props.isHiddenWhenEmpty && openIssueNodes.length === 0 ) {
    return <div/>;
  }
  
  // isLoading = issuesQuery.loading
  return (
    <Card key={`user-${props.username}`} 
          title={milestoneTitle} 
          subtitle={milestoneSubtitle()}
          titleUrl={userUrl} 
          isLoading={false}
          option={cardOption}
          icon='🗓'
          iconTip='Press s or click to sort'
          onClickIcon={handleResetOrdering}
          onKey={handleKeyOnCard}>

      { issuesToShow() }
      
      <Issue key='new' 
             team={props.team} 
             milestones={props.milestones}
             defaultCategory={props.username === 'fixes' ? CATEGORY_BUG : CATEGORY_FEATURE}
             isCreating={true} 
             onUpdateIssue={handleUpdateIssue} 
             onNeedsKeyboard={handleNeedsKeyboard}
             focusRequestedAt={focusRequestedAt}
             stats={stats()}
      />

    </Card>
  );
}

export default UserIssues;