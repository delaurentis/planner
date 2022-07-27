import React from 'react';
import styles from './Chip.module.css';

type ChipSize = "small" | "medium";

interface ChipProps {
  url?: string;
  size?: ChipSize;
  children: React.ReactNode;
  isBlank?: boolean;
  isLoading?: boolean;
  isAlerting?: boolean;
  isSelected?: boolean;
  onClick?(): void;
}

const Chip: React.FC<ChipProps> = (props) => {

  return (
    <a className={styles.Chip}
       {...{bigness: `${props.size || 'small'}`}} 
       {...{blank: `${props.isBlank}`}} 
       {...{loading: `${props.isLoading}`}} 
       {...{alerting: `${props.isAlerting}`}} 
       {...{selecting: `${props.isSelected}`}} 
       href={props.url} 
       target='_blank' 
       rel='noopener noreferrer'
       onClick={() => props.onClick?.()}>
      <span>
        {props.children}
      </span>
    </a>
  );
}

export default Chip;