import React from 'react';
import Button from './Button';
import styles from './Prompt.module.css';

interface PromptProps {
  children?: React.ReactNode;
  onClosePrompt?(): void;
}

const Prompt: React.FC<PromptProps> = (props) => {

  return (
    <div className={styles.Prompt}>
      <span className={styles.Options}>{props.children}</span>
      <span className={styles.Button}>
        <Button title='Done' size='medium' onClick={() => props.onClosePrompt?.()}/>
      </span>
    </div>

  );
}

export default Prompt;