// NOTE: I hope to use this file soon but right now when I 
// separate this from the listing it's no longer updating the UI
// when we change the apollo cache

import React, { useState } from 'react';
import { Issue as IssueType, Team} from 'data/types';
import Chip from 'components/presentation/Chip';
import IssueAssignees from './IssueAssignees';
import { titleForUsername } from 'data/teams';
import { useMutation } from '@apollo/client';
import { SET_ISSUE_ASSIGNEES } from 'data/queries';

interface IssueAssigneeProps {
  issue: IssueType;
  team?: Team;
  username?: string;
  onUpdating?(updating: boolean): void;
}

const IssueAssignee: React.FC<IssueAssigneeProps> = (props) => {

  const [isEditing, setEditing] = useState<boolean>(false);
  
  // Update assignee
  const [setAssignees, assigneeMutation] = useMutation(SET_ISSUE_ASSIGNEES);
  const handleSelectAssignee = (username: string) => {

    // When the assignee is updated on the server, cache locally
    const updatedAssignee = (cache, assigneeMutation) => {

      // Make sure the UI knows that the change has been written
      props.onUpdating?.(false);
    }
    
    // To update the assignee, we need the project path
    const projectPath: string | undefined = props.issue.webPath?.split('/-')?.[0].slice(1);
    setAssignees({ update: updatedAssignee,
                   variables: { projectPath: projectPath, 
                                iid: props.issue?.iid, 
                                usernames: username === 'none' ? [] : [username]}, 
              });
    
    // This will trigger the parent to update it's UI
    props.onUpdating?.(true);

    // Hide picker
    setEditing(false);
  }

  // Only show the assignee picker if we're editing
  const picker = () => {
    if ( isEditing ) {
      return (
        <span>
          <IssueAssignees team={props.team}
                          username={props.username}
                          onSelectAssignee={handleSelectAssignee}
                          onCancel={() => setEditing(false)}/>
        </span>
      );
    }
    return undefined;
  }

  // Our chip and hidden assignee picker
  const firstAssigneeUsername = props.issue.assignees?.nodes?.[0]?.username;
  return (
    <span>
      <Chip size='medium' 
            isAlerting={firstAssigneeUsername === undefined}
            isLoading={assigneeMutation.loading} 
            isBlank={props.issue.assignees?.length === 0} 
            onClick={() => setEditing(true)}>
        {titleForUsername(firstAssigneeUsername || '') || 'None'}
      </Chip>
      {picker()}
    </span>
  );
}

export default IssueAssignee;
