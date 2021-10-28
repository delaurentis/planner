import React from 'react';
import Epic from './Epic';
import Card from '../presentation/Card';
import { Epic as EpicType, Team } from 'data/types';

import { useQuery } from '@apollo/client';
import { MILESTONE_EPICS } from 'data/queries';
import { polling } from 'data/polling';

interface MilestoneEpicsProps {
  milestone?: any;
  showClosed: boolean;
  labels?: string[];
  project?: string;
  team?: Team;
  epics?: EpicType[];
}

const MilestoneEpics: React.FC<MilestoneEpicsProps> = (props: MilestoneEpicsProps) => {

  // The card has a setting that controls what we show on the right column
  // We'll store that setting globally for all cards
  /*const client = useApolloClient();
    const handleExtra = (option: Option, choice: OptionChoice) => {
    client.writeQuery({ query: EXTRA_COLUMN, data: { extraColumn: choice.title } });
    window.localStorage.setItem('extraColumn', choice.title);
  }*/

  // Figure out our variables for the query
  const variables = () => {
    return { milestone:  props.milestone.title, labels: props.labels } 
  }
  
  // Load open AND closed issues from cache, then API, and then refresh every second
  const gqlOpen = MILESTONE_EPICS;
  const open = useQuery(gqlOpen, { pollInterval: polling.frequency.epics, variables: variables() }) || {};
  // const closed = useQuery(CLOSED_ISSUES, { pollInterval: 1200, variables: variables() }) || {};

  // Extract our issues from the data returned
  const openNodes = open.data?.group?.epics?.nodes || [];

  const hash = openNodes.reduce((hash, node) => {
    hash[node.id] = node;
    return hash;
  }, {});

  const uniqueNodes = Object.keys(hash).map(key => {
    return hash[key];
  });

  // const closedNodes =  closed.data?.group?.issues?.nodes || [];

  // Get any epics associated with these issues
  // ...

  // The user tried to update an issue
  //const [updateIssue] = useMutation(UPDATE_ISSUE);
  //const [createIssue] = useMutation(CREATE_ISSUE);
  const handleUpdateEpic = (update: any, issue: any) => {
/*    if ( issue ) {  

      // Get the project name for this issue and figure out the ID
      const issueProjectName: string = issue.webPath?.split('/')?.[2];
      const issueProjectId = projects[issueProjectName];

      // Now update the issue within the right project!
      updateIssue({ variables: { projectId: issueProjectId, id: issue.iid, input: update }});
    }
    else {

      // When we add issues to someone, we check what project they are a part of
      // This is because some teams, like ops are on different projects
      const userProjectId = projects[props.project || 'reponame'];

      // Take any labels that are special for a user and then add the standard ones
      const labelsForTeam = props.labels;
      const standardLabels: string[] = props.username === 'none' ? ['Triage 🛎'] : ['P2 🙏'];
      const standardAndCustomLabels = labelsForTeam?.concat(labelsForUsername(props.username)).concat(standardLabels);
      const uniqueLabels = [...new Set(standardAndCustomLabels)];

      createIssue({ variables: 
        { projectId: userProjectId, 
          input: {...update, 
                  ...optionalAssignee,
                  milestone_id: props.milestone.id,
                  labels: uniqueLabels.join(',') }}});
    }*/
  }

  /*const closedIssues = () => {
    if ( props.showClosed ) {
      return closedNodes.map((issue: any) => 
        <Epic key={issue.id} 
               issue={issue} 
               epics={props.epics} 
               team={props.team}
               milestone={props.milestone}
               extraColumn={'Labels'} 
               onUpdateIssue={handleUpdateEpic}/>
      );
    } 
  }*/

  const openEpics = () => uniqueNodes.map((epic: any) => 
    <Epic key={epic.id} 
           epic={epic} 
           team={props.team}
           milestone={props.milestone}
           extraColumn={'Labels'} 
           onUpdateEpic={handleUpdateEpic}/>
  );

  // Controls what we show in the right column
  /*const cardOption: Option = {
    title: 'Labels',
    name: 'labels',
    isSelected: false,
    isSelectable: false,
    isExpandable: false,
    choices: extraColumns,
    onSelectOption: handleExtra
  };*/

  // const newEpic = <Epic key='new' team={props.team} isEditing={true} onUpdateEpic={handleUpdateEpic}/>;

  return (
    <Card key='epics'
          title='Epics'
          titleUrl='https://gitlab.companyname.com/team/reponame/-/epics'
          isLoading={false}
          >

      { openEpics() }

    </Card>
  );
}

export default MilestoneEpics;