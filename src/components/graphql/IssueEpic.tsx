// NOTE: I hope to use this file soon but right now when I 
// separate this from the listing it's no longer updating the UI
// when we change the apollo cache

import React, { useState } from 'react';
import { Issue as IssueType, 
         Epic as EpicType } from 'data/types';
import Chip from 'components/presentation/Chip';
import IssueEpics from './IssueEpics';
import { useMutation, gql, useApolloClient } from '@apollo/client';
import { SET_ISSUE_EPIC } from 'data/queries';

interface IssueEpicProps {
  issue: IssueType;
  epics?: EpicType[];
  onUpdating?(updating: boolean): void;
}

const IssueEpic: React.FC<IssueEpicProps> = (props) => {

  // If the epic gets clicked, show our autocomplete
  const [isEditing, setEditing] = useState<boolean>(false);
  
  // Update the epic for this in the cache
  const client = useApolloClient();
  const cacheIssueWithEpicID = (epicId: string, updatedAt: any) => {
    client.writeFragment({
      id: `Issue:${props.issue.id}`,
      fragment: gql`fragment IssueWithNewEpic on Issue { epic, updatedAt }`,
      data: { __typename: 'Issue', epic: { '__ref': `Epic:${epicId}` }, updatedAt: updatedAt } 
    });  
  }

  // Update epic
  const [setEpic, epicMutation] = useMutation(SET_ISSUE_EPIC);
  const handleSelectEpic = (epic: EpicType) => {

    // When the epic is updated on the server, cache locally
    const updatedEpic = (cache, epicMutation) => {
      const updatedIssue = epicMutation.data?.issueSetEpic?.issue;
      cacheIssueWithEpicID(updatedIssue?.epic?.id, updatedIssue?.updatedAt); 

      // Make sure the UI knows that the change has been written
      props.onUpdating?.(false);
    }
    
    // To update the epic, we need the project path
    const projectPath: string | undefined = props.issue.webPath?.split('/-')?.[0].slice(1);
    setEpic({ update: updatedEpic,
              variables: { projectPath: projectPath, 
                           iid: props.issue?.iid, 
                           epicId: epic?.id }, 
              });
    
    // Optimistically update cache
    cacheIssueWithEpicID(epic?.id, new Date().toISOString());  

    // This will trigger the parent to update it's UI
    props.onUpdating?.(true);

    // Hide picker
    setEditing(false);
  }

  // Only show the epic picker if we're editing
  const epicPicker = () => {
    if ( isEditing ) {
      return (
        <span>
          <IssueEpics epics={props.epics} 
                      currentEpic={props.issue.epic}
                      onSelectEpic={handleSelectEpic}
                      onCancel={() => setEditing(false)}/>
        </span>
      );
    }
    return undefined;
  }

  // Our chip and hidden epic picker
  return (
    <span>
      <Chip size='medium' 
            isCenteredVertically={true}
            isLoading={epicMutation.loading} 
            isBlank={!props.issue.epic?.title} 
            onClick={() => setEditing(true)}>
        {props.issue.epic?.title || 'None'}
      </Chip>
      {epicPicker()}
    </span>
  );
}

export default IssueEpic;
