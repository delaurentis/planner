import React from 'react';
import styles from './Arena.module.css';

interface ArenaProps {
  children?: React.ReactNode;
}

const Arena:React.FC<ArenaProps> = (props: ArenaProps) => {
  return (
    <div className={styles.Arena}>
      {props.children}
    </div>
  );
}

export default Arena;
