import React from 'react';
import styles from './Shade.module.css';

interface ShadeProps {
  onClick(): void;
}

const Shade: React.FC<ShadeProps> = (props) => {
  return (
    <div className={styles.Shade} onClick={() => props.onClick?.()}>
    </div>
  );
}

export default Shade;