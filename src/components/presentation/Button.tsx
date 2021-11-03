import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  title: string;
  isSmall?: boolean;
  isDisabled?: boolean;
  onClick(): void;
}

const Button: React.FC<ButtonProps> = (props) => {
  
  // Send click upward for top level logic to handle 
  // We're just a minion down here with very little context
  const handleClick = () => {
    if ( props.onClick ) {
      props.onClick();
    }
  }
  
  const customProps = { issmall: `${props.isSmall}`, isdisabled: `${props.isDisabled}`};
  return (
    <div className={styles.Button} {...customProps} onClick={handleClick}>
      <div className={styles.ButtonText}>{props.title}</div>
    </div>
  );
}

export default Button;
