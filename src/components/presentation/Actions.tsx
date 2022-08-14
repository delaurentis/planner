import React from 'react';
import Action from './Action';
import { Action as ActionType } from 'data/types';
import styles from './Actions.module.css';

interface ActionsProps {
  actions: ActionType[];
  isShowingShortcuts?: boolean;
  onClickAction(action: ActionType): void;
}

const Actions: React.FC<ActionsProps> = (props: ActionsProps) => {

  const handleClickAction = (action: ActionType) => {
    if ( props.onClickAction ) {
      props.onClickAction(action);
    }
  }

  return (
    <div className={styles.Actions}>
      {props.actions.map((action: ActionType) => {
        return (
          <Action 
            key={action.name} 
            action={action} 
            isShowingShortcut={props.isShowingShortcuts} 
            onClick={() => handleClickAction(action)}
          />
        )
      })}
    </div>
  );
}

export default Actions;
