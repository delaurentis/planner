import React from 'react';
import styles from './RadioItem.module.css';

interface RadioItemProps {
  answer: string;
  isSelected: boolean;
  onClickAnswer?(answer: string): void;
}

const RadioItem: React.FC<RadioItemProps> = (props) => {

  // When they click, toggle whether the day is selected
  const handleClick = () => {
    props.onClickAnswer?.(props.answer);
  }
  
  return (
    <a className={styles.RadioItem}
       { ...{ winner: props.isSelected ? "true" : undefined } }
       onClick={handleClick}>
       {props.answer}
    </a>
  );
}

export default RadioItem;