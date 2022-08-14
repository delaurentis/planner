import React from 'react';
import styles from './Arena.module.css';

interface ArenaProps {
  children?: React.ReactNode;
  detailPane?: React.ReactNode;
}

const Arena:React.FC<ArenaProps> = (props: ArenaProps) => {
  return (
    <div className={styles.Arena}>
      <span className={styles.MainPane}>{props.children}</span>
      <span className={styles.DetailPane}>{props.detailPane}</span>
    </div>
  );
}

export default Arena;
