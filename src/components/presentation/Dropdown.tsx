import React from 'react';
import styles from './Dropdown.module.css';

interface DropdownProps {
  children: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = (props: DropdownProps) => {
  return (
    <div className={styles.Dropdown}>
      <div className={styles.DropdownContent}>{props.children}</div>
    </div>
  );
}


export default Dropdown;