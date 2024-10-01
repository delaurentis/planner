import React from 'react';
import Icon from 'components/icons/Icon'; // Adjust import path accordingly
import styles from './Cell.module.css';
//import { CellContents } from 'types';

interface CellProps {
  //contents: CellContents;
  tag: string;
  isFilled?: boolean;
  icon?: string; // Use string for icon name
  onTagClick?(tag: string): void;
}

const Cell: React.FC<CellProps> = ({ tag, isFilled = false, icon, onTagClick }) => {
  
  const iconArgs = {
    fill: 'rgba(0,0,0,0.15)',
    width: 20,
    height: 20
  }
  
  return (
    <div 
      className={`${styles.Cell} ${isFilled ? styles.filled : ''}`}
      onClick={() => onTagClick && onTagClick(tag)}
    >
      {isFilled && icon && <Icon {...iconArgs} name={icon} />}
    </div>
  );
}

export default Cell;
