import React, { useEffect, useRef } from 'react';
import Issue from './Issue';
import Card from '../presentation/Card';
import { Epic, Option, OptionChoice, Team } from 'data/types';
import { extraColumns } from 'data/extras';
import { polling } from 'data/polling';
import { projects } from 'data/projects';

import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { ALL_ISSUES, 
         OPEN_UNASSIGNED_ISSUES,
         ALL_BUG_ISSUES, 
         UPDATE_ISSUE, 
         CREATE_ISSUE,
         DELETE_ISSUE, 
         USER,
         EXTRA_COLUMN } from 'data/queries';
import { CATEGORY_FEATURE, CATEGORY_BUG } from 'data/categories';
import { labelNameFromEnvironment } from 'data/environments';
import { orderingForIssue } from 'data/labels';
import { durableOrder, DurableOrderSnapshot } from 'util/durableOrder';

interface UserIssuesProps {
  username: string;
  milestone?: any;
  milestones?: any[];
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
      return { username: 'none', milestones: [props.milestone.title], labels: props.labels };
    }
    else if ( props.username === 'fixes' ) {
      return { milestones: [props.milestone.title], labels: [...props.labels || [], 'Debug 🐞']  };
    }
    else {
      return { username: props.username, milestones: [props.milestone.title] };
    }
  }
  
  const gqlForIssues = () => {
    if ( props.username === 'none' ) {
      return OPEN_UNASSIGNED_ISSUES;
    }
    else if ( props.username === 'fixes' ) {
      return ALL_BUG_ISSUES;
    }
    else {
      return ALL_ISSUES;
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
  const issueNodes = issuesQuery.data?.group?.issues?.nodes || [];

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
  const handleUpdateIssue = (update: any, issue: any) => {
  
    // We will re-fetch the query from apollo after any mutations
    // Temporarily turn off polling since they can conflict and cause the screen to flash white
    stopPolling();

    // Are we modifying an existing issue, or creating a new one?
    if ( issue ) {  

      // Get the project name for this issue and figure out the ID
      const issueProjectName: string = issue.webPath?.split('/')?.[2];
      const issueProjectId = projects[issueProjectName];

      // Delete the issue if that's been requested
      if ( update.delete ) {
        deleteIssue({ variables: { projectId: issueProjectId, id: issue.iid }});
      }
      else {
        // Now update the issue within the right project!
        updateIssue({ variables: { projectId: issueProjectId, id: issue.iid, input: update }});
      }
    }
    else {

      // Remove any metadata we use internally from the update
      const { meta, ...updateWithoutMeta } = update;
      const categoryLabels = meta.category === '🐞 Bug' ? ['Debug 🐞'] : [];
      const environmentLabels = meta.environment ? [labelNameFromEnvironment(meta.environment)] : [];

      // When we add issues to someone, we check what project they are a part of
      // This is because some teams, like ops are on different projects
      const userProjectId = projects[props.project || 'reponame'];

      // Take any labels that are special for a user and then add the standard ones
      const labelsForTeam = props.labels || [];
      const standardLabels: string[] = (props.username === 'none' || props.username === 'fixes') ? ['Triage 🛎'] : ['P2 🙏'];
      const standardAndCustomLabels: string[] = labelsForTeam.concat(standardLabels);
      const allLabels: string[] = standardAndCustomLabels.concat(categoryLabels).concat(environmentLabels);
      const uniqueLabels = [...new Set(allLabels)];

      createIssue({ variables: 
        { projectId: userProjectId, 
          input: {...updateWithoutMeta, 
                  ...optionalAssignee,
                  milestone_id: props.milestone.id,
                  labels: uniqueLabels.join(',') }}});
    }

    // Revert to slower timeouts after N seconds
    setTimeout(() => { 
      startPolling(polling.frequency.allIssue);
    }, polling.period.changedIssue);
  }

  // Figure out title and where it goes if you click iot
  const userUrl: string = `https://gitlab.companyname.com/team/reponame/-/issues?scope=all&utf8=%E2%9C%93&assignee_username[]=${props.username}&milestone_title=${props.milestone.title}`

  // Determine if we've set orderings before... only happens once data gets loaded the first time
  const { sortedItems, orderingSnapshot } = durableOrder(issueNodes, orderingForIssue, orderingsRef.current);
  orderingsRef.current = orderingSnapshot;
  
  const issuesToShow = () => sortedItems.map((issue: any) => 
    <Issue key={issue.id} 
           issue={issue} 
           epics={props.epics} 
           team={props.team}
           milestone={props.milestone}
           milestones={props.milestones}
           extraColumn={extraQuery.data?.extraColumn} 
           onUpdateIssue={handleUpdateIssue}/>
  );

  // Controls what we show in the right column
  const cardOption: Option = {
    title: extraQuery.data?.extraColumn,
    name: extraQuery.data?.extraColumn,
    isSelected: false,
    isSelectable: false,
    isExpandable: true,
    choices: extraColumns,
    onSelectOption: handleExtra
  };

  // Don't show anything if we're supposed to hide it if empty
  const openIssueNodes = sortedItems.filter(node => (node as any).state !== 'closed');
  if ( props.isHiddenWhenEmpty && openIssueNodes.length === 0 ) {
    return <div/>;
  }

  // isLoading = issuesQuery.loading
  return (
    <Card key={`user-${props.username}`} 
          title={props.milestone.title} 
          titleUrl={userUrl} 
          isLoading={false}
          option={cardOption}>

      { issuesToShow() }
      
      <Issue key='new' 
             team={props.team} 
             defaultCategory={props.username === 'fixes' ? CATEGORY_BUG : CATEGORY_FEATURE}
             isEditing={true} 
             onUpdateIssue={handleUpdateIssue} />

    </Card>
  );
}

export default UserIssues;