import React, { useState } from 'react';
import RadioItem from './RadioItem';
import styles from './Radio.module.css';

interface RadioProps {
  answers: string[];
  selectedAnswer: string;
  onClickRadio?(newAnswer: string): void;
}

const Radio: React.FC<RadioProps> = (props) => {

  // Pass up any clicks to the parent.  They're the keeper of state.
  const handleClickAnswer = (newAnswer: string) => {
    props.onClickRadio?.(newAnswer);
  }
  
  return (
    <span className={styles.Radio}>
       {
         props.answers.map(answer => 
           <RadioItem answer={answer} 
                      isSelected={answer === props.selectedAnswer}
                      onClickAnswer={handleClickAnswer}/>
         )
      }
    </span>
  );
}

export default Radio;