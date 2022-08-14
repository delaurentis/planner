import React from 'react';
import styles from './Button.module.css';

type ButtonSizeType = 'large' | 'medium' | 'small'

interface ButtonProps {
  title: string;
  size?: ButtonSizeType;
  isDisabled?: boolean;
  isSecondary?: boolean;
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
  
  const customProps = { vastness: `${props.size}`, isdisabled: `${props.isDisabled}`, secondary: `${props.isSecondary}` };
  return (
    <div className={styles.Button} {...customProps} onClick={handleClick}>
      <div className={styles.ButtonText}>{props.title}</div>
    </div>
  );
}

export default Button;
