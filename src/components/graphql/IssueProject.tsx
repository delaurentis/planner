// NOTE: I hope to use this file soon but right now when I 
// separate this from the listing it's no longer updating the UI
// when we change the apollo cache

import React, { useState } from 'react';
import { Issue as IssueType, Team } from 'data/types';
import Chip from 'components/presentation/Chip';
import IssueProjects from './IssueProjects';
import { capitalizeFirstLetter } from 'util/capitalize';
import { projects } from 'data/projects';
import { MOVE_ISSUE, DELETE_ISSUE } from 'data/queries';
import { useMutation, useApolloClient, gql } from '@apollo/client';

interface IssueProjectProps {
  issue: IssueType;
  team?: Team;
  project?: string;
  onUpdate?(update: any): void;
  onUpdating?(updating: boolean): void;
}

const IssueProject: React.FC<IssueProjectProps> = (props) => {

  // Give a way to update the cache so we can show the change quickly
  const client = useApolloClient();
  const cacheIssueWithProjectId = (projectId: number, updatedAt: any) => {
    client.writeFragment({
      id: `Issue:${props.issue.id}`,
      fragment: gql`fragment IssueWithNewProject on Issue { projectId, updatedAt }`,
      data: { __typename: 'Issue', projectId, updatedAt } 
    });  
  }

  // Controls whether or not the popup is showing because
  // if we are editing the project we need to show it
  const [isEditing, setEditing] = useState<boolean>(false);
  const [oldIssue, setOldIssue] = useState<IssueType>({...props.issue});

  // After deletion we'll signal that we're done updating
  const [deleteIssue, deleteMutation] = useMutation(DELETE_ISSUE, { onCompleted: () => {
    props.onUpdating?.(false);
  } });

  // We'll need to move our issue to the new project, and then delete 
  // the original since the API call just clones it :(
  const [moveIssue, moveMutation] = useMutation(MOVE_ISSUE, { onCompleted: () => { 
    deleteIssue({ variables: { projectId: oldIssue.projectId, id: oldIssue.iid } });
  } });

  // Get the project name based on the ID
  const currentProject = Object.keys(projects).find(projectName => projects[projectName] === props.issue.projectId);

  // Update project when the user changes it
  const handleSelectProject = (project: string) => {

    // Move the issue now
    const newProjectId: number = projects[project];
    moveIssue({ variables: { projectId: props.issue.projectId, id: props.issue.iid, input: { to_project_id: newProjectId} }});

    // Feed the new project into the cache
    cacheIssueWithProjectId(newProjectId, new Date());

    // Signal to the UI that we're updating
    props.onUpdating?.(true);

    // Switch the issue to a new project if it's different
    // props.onUpdate?.({ project: project });

    // Hide picker
    setEditing(false);
  }

  // Only show the project picker if we're editing
  const picker = () => {
    if ( isEditing ) {
      return (
        <span>
          <IssueProjects team={props.team}
                          project={currentProject}
                          onSelectProject={handleSelectProject}
                          onCancel={() => setEditing(false)}/>
        </span>
      );
    }
    return undefined;
  }

  // Our chip and hidden project picker
  return (
    <span>
      <Chip size='medium' 
            isAlerting={false}
            isLoading={moveMutation.loading || deleteMutation.loading} 
            isBlank={false} 
            onClick={() => setEditing(true)}>
        {capitalizeFirstLetter(currentProject || '')}
      </Chip>
      {picker()}
    </span>
  );
}

export default IssueProject;
