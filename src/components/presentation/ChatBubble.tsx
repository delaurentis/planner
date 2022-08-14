import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatBubble.module.css';
import ReactTimeAgo from 'react-time-ago'
import Button from  '../presentation/Button';
import GrowingText from '../presentation/GrowingText';

interface ChatBubbleProps {
  who?: string;
  when?: Date;
  rawText?: string;
  children?: React.ReactNode;
  isEditing?: boolean;
  focusRequestedAt?: number;
  onSend?(rawText: string): void;
}

const ChatBubble:React.FC<ChatBubbleProps> = (props: ChatBubbleProps) => {
  
  // Start our internal editable text with any raw text passed in
  const [editableText, setEditableText] = useState(props.rawText || '');

  // This helps us clear the text on demand
  const [clearRequestedAt, setClearRequestedAt] = useState<number | undefined>();

  // When the user presses send, pass the value to the parent and clear the text
  const handleClickSend = () => {

    // Send text to parent (who will send to the server)
    props.onSend?.(editableText);

    // Clear the text
    setClearRequestedAt(new Date().getTime());
  }

  // Support either showing readable rendered markdown, or editable text
  const content = () => {
    if ( props.isEditing ) {
      return (
        <GrowingText 
          placeholder='Type message here...' 
          text={editableText} 
          onChange={(text: string) => setEditableText(text)} 
          focusRequestedAt={props.focusRequestedAt} 
          clearRequestedAt={clearRequestedAt} 
        />
      )
    }
    return props.children;
  }

  const icon = () => { return '💬'; }

  const elapsed = () => {
    if ( props.when ) {
      return (
        <span className={styles.BubbleTime}>
          <ReactTimeAgo date={props.when} locale="en-US"/>
        </span>
      )
    }
    return undefined;
  }

  const button = () => {
    if ( props.isEditing && editableText?.length ) {
      return (
        <div className={styles.BubbleButton}>
          <Button title='Send' size='small' onClick={() => { handleClickSend() }}/>
        </div>
      )
    }
    return undefined;
  }

  return (
    <div className={styles.ChatBubble}>
      <div className={styles.BubbleHeader}>
        <span className={styles.BubbleAuthor}>
          <span className={styles.BubbleIcon}>{icon()}</span>
          {props.who}
        </span>
        {elapsed()}
        {button()}
      </div>
      <div className={styles.BubbleContent}>
        {content()}
      </div>
    </div>
  )
}

export default ChatBubble;