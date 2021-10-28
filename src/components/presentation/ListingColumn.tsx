import React from 'react';
import styles from './ListingColumn.module.css';

type ColumnColor = 'black' | 'red' | 'green' | 'gray' | 'yellow';
type ColumnType = 'icon' | 'number' | 'tiny' | 'bigNumber' | 'small' | 'medium' | 'large' | 'whitespace' | 'widespace' | 'halfspace' | 'unlimited';
type ColumnAlignment = 'left' | 'center' | 'right';

interface ListingColumnProps {
  url?: string;
  type: ColumnType;
  color?: ColumnColor | 'black';
  alignment?: ColumnAlignment | 'left';
  children?: React.ReactNode;
  onClick?(): void;
}

const ListingColumn: React.FC<ListingColumnProps> = (props) => {

  return (
    <a className={styles.ListingColumn}
       {...{variety: props.type, alignment: props.alignment, coloring: props.color}}
       href={props.url} 
       target='_blank' 
       rel='noopener noreferrer'
       onClick={() => props.onClick?.()}>
      {props.children}
    </a>
  );
}

export default ListingColumn;