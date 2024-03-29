import React from 'react';
import styles from './Action.module.css';
import { Action as ActionType } from 'data/types';

interface ActionProps {
  action: ActionType;
  isShowingShortcut?: boolean;
  onClick(): void;
}

const Action: React.FC<ActionProps> = (props: ActionProps) => {

  const handleClick = () => {
    if ( props.onClick ) {
      props.onClick();
    }
  }

  const shortcut = () => {
    if ( props.action.shortcut && props.isShowingShortcut) {
      return <span className={styles.ActionShortcut}>{props.action.shortcut}</span>
    }
    return undefined;
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
      {shortcut()}
    </span>
  );
}

export default Action;
