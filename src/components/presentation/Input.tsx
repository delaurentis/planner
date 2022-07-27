import React, { useState } from 'react';
import styles from './Input.module.css';

interface InputProps {
  value?: string;
  onBlur?(value: string | undefined): void;
}

const Input: React.FC<InputProps> = (props) => {

  // Start off using the value given
  const [editableValue, setEditableValue] = useState(props.value || "");

  // Allow changing of the text
  const handleChange = (event) => {
    setEditableValue(event.target.value);
  }

  // On blur, notify parent of changed text
  const handleBlur = () => {
    if ( editableValue?.length && props.value !== editableValue ) {
      props.onBlur?.(editableValue);
    }
  }

  return (
    <div className={styles.InputWrapper}>
        <input className={styles.Input} value={editableValue} onChange={handleChange} onBlur={handleBlur}/>
    </div>
  );
}

export default Input;