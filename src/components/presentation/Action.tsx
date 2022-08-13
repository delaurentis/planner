import React from 'react';
import styles from './Action.module.css';
import { Action as ActionType } from 'data/types';

interface ActionProps {
  action: ActionType;
  onClick(): void;
}

const Action: React.FC<ActionProps> = (props: ActionProps) => {

  const handleClick = () => {
    if ( props.onClick ) {
      props.onClick();
    }
  }

  return (
    <span 
      className={styles.Action} 
      onClick={handleClick} 
      title={props.action.shortcut ? `Press ${props.action.shortcut}`: undefined}
      {...{ undo: props.action.isUndo ? 'true' : undefined } }
    >
      <span className={styles.ActionIcon}>{props.action.icon}</span>
      <span className={styles.ActionName}>{props.action.name}</span>
    </span>
  );
}

export default Action;
