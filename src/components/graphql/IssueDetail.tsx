import React, { useState, useEffect } from 'react';
import { Issue as IssueType } from 'data/types';
import DetailPane from 'components/presentation/DetailPane';
import { useQuery, useMutation } from '@apollo/client';
import { ISSUE_DETAIL, CREATE_NOTE, UPDATE_ISSUE } from 'data/queries';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { organization } from 'data/customize';
import { projects } from 'data/projects';
import { primaryLabelForIssue } from 'data/labels';
import { polling } from 'data/polling';
import ChatBubble from 'components/presentation/ChatBubble';
import GrowingText from 'components/presentation//GrowingText';

interface IssueDetailProps {
  issueId?: string;
  onClose?(): void;
}

const IssueDetail: React.FC<IssueDetailProps> = (props) => {

  // Lookup the given issue
  const issueDetailQuery = useQuery(ISSUE_DETAIL, { variables: { id: props.issueId } });
  const issue: IssueType = issueDetailQuery.data?.issue; 
  const primaryLabel = issue ? primaryLabelForIssue(issue) : {};

  // Poll for changes to open issues 
  // (fix for bug in Apollo that doesn't stop polling when you navigate away)
  const startPolling = issueDetailQuery.startPolling;
  const stopPolling = issueDetailQuery.stopPolling;
  useEffect(() => {
    startPolling(polling.frequency.issueDetail);
    return () => {
      stopPolling();
    }
  }, [startPolling, stopPolling])

  // Find the project name for this issue
  const projectName: string | undefined = Object.keys(projects).find(project => projects[project] === issue?.projectId);

  // Transformations for links and images 
  const transformLinkUri = (href, children, title) => href?.indexOf('://') > 0 ? href : `https://gitlab.com/${href}`;
  const transformImageUri = (src, alt, title) => {
    if ( src.includes('https://') ) {
      return src
    }
    else
    {
      return `https://gitlab.com/${organization}/${projectName}${src}`
    }
  }

  // Filter out the user notes (not the system messages)
  const userNotes = issue?.notes?.nodes?.filter(note => !note.system)
  const sortedUserNotes = userNotes?.sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  // Update the issue if anything is changed
  const refetchQueries = [{ query: ISSUE_DETAIL, variables: { id: props.issueId } }];

  // Mutation to create a note (and re-fetch the issue right after)
  // We also will re-focus on the note after the new one is received so the user can type the next comment
  const [focusRequestedAt, setFocusRequestedAt] = useState<number | undefined>(undefined);
  const [createNote] = useMutation(CREATE_NOTE, { refetchQueries, onCompleted(data) {
    setFocusRequestedAt(new Date().getTime());
  }, });
  const handleCreateNote = (rawText: string) => {
    createNote({ variables: { projectId: issue?.projectId, issueId: issue?.iid, input: { body: rawText } } });
  }

  // Are we editing the description?
  const [isEditingDescription, setEditingDescription] = useState<boolean>(false);
  const [editableDescription, setEditableDescription] = useState<string>(issue?.description || '');
  const [descriptionFocusRequestedAt, setDescriptionFocusRequestedAt] = useState<number | undefined>(undefined);
  useEffect(() => {
    setEditableDescription(issue?.description || '');
  }, [issue?.description])

  // If the issue changes, clear the editing state
  useEffect(() => {
    setEditingDescription(false);
  }, [issue?.iid])

  // Save on command
  const [updateIssue] = useMutation(UPDATE_ISSUE, { refetchQueries });
  const handleSaveDescription = () => {
    updateIssue({ variables: { projectId: issue?.projectId, id: issue?.iid, input: { description: editableDescription } } });
    setEditingDescription(false);
  }

  // The content of the pane
  const content = () => {
    if ( isEditingDescription ) {
      return (
        <GrowingText
          placeholder='Enter a description...'
          text={editableDescription}
          focusRequestedAt={descriptionFocusRequestedAt}
          onChange={(text) => { setEditableDescription(text); }}
        />
      )
    }
    else {
      return (
        <div>
          <ReactMarkdown 
            children={issue?.description || ''}
            remarkPlugins={[remarkGfm]}
            transformLinkUri={transformLinkUri}
            transformImageUri={transformImageUri}
          />
          {
            sortedUserNotes.map(note => {
              return (
                <ChatBubble who={note.author?.name} when={note.createdAt}>
                  <ReactMarkdown 
                    children={note?.body || ''}
                    remarkPlugins={[remarkGfm]}
                    transformLinkUri={transformLinkUri}
                    transformImageUri={transformImageUri}
                  />
                </ChatBubble>
              );
            })
          }
          <ChatBubble 
            who='You' 
            isEditing={true} 
            focusRequestedAt={focusRequestedAt} 
            onSend={(rawText) => { handleCreateNote(rawText) }}
          />
        </div>
      )
    }
  }

  // Do we have an issue ID?
  if ( props.issueId && issue ) {
    return (
      <DetailPane 
        icon={primaryLabel?.icon} 
        title={`${issue?.iid}`} 
        titleUrl={`https://gitlab.com/${issue.webPath}`}
        titleTip={issue?.title}
        subtitle={issue?.title}
        isEditing={isEditingDescription}
        onSave={() => { handleSaveDescription() }}
        onEditing={(editing: boolean) => { 
          setEditingDescription(editing); 
          if ( editing ) {
            setDescriptionFocusRequestedAt(new Date().getTime()); 
          }
        }} 
      >
        {content()}
      </DetailPane>
    )
  }
  else {
    return <div/>;
  }
}

export default IssueDetail;
