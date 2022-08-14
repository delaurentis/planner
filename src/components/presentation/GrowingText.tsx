import React, { useState, useEffect, useRef } from 'react';
import styles from './GrowingText.module.css';

interface GrowingTextProps {
  text?: string;
  placeholder?: string;
  style?: any;
  focusRequestedAt?: number;
  clearRequestedAt?: number;
  onChange?: (text: string) => void;
}

const GrowingText:React.FC<GrowingTextProps> = (props: GrowingTextProps) => {
  
  // Start our internal editable text with any raw text passed in
  const [editableText, setEditableText] = useState(props.text || '');

  // When text changes, update it
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableText(event.target.value);
    props.onChange?.(event.target.value);
  }

  // We need a reference to our textarea
  const textAreaRef: any = useRef<HTMLTextAreaElement>();

  // If the focus is requested, focus the textarea
  useEffect(() => {
    if ( props.focusRequestedAt && props.focusRequestedAt > 0 && textAreaRef.current ) {
      textAreaRef?.current?.focus();
      setTimeout(() => {
        textAreaRef?.current?.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
      }, 1000);
    }
  }, [props.focusRequestedAt])

  // If a clear is requested, clear the text
  useEffect(() => {
    if ( props.clearRequestedAt ) {
      setEditableText('');
      if ( textAreaRef.current ) {
       textAreaRef.current.value = '';
      }
    }
  }, [props.clearRequestedAt]) 

  return (
    <div className={styles.GrowingTextContainer} style={props.style}>
      <textarea 
        ref={textAreaRef}
        className={styles.Input} 
        placeholder={props.placeholder}
        onChange={handleChange}>
        {editableText}
      </textarea>
      <div className={styles.Replica}>{`${editableText} `}</div>
    </div>
  )
}

export default GrowingText;