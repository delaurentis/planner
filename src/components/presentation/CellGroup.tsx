import React from 'react';
import Cell from './Cell';
import styles from './CellGroup.module.css';

interface CellGroupProps {
  tags: string[];
  isTagFilled: { [key: string]: boolean };
  tagIcon: { [key: string]: string };
  onTagClick?(tag: string): void;
}

const CellGroup: React.FC<CellGroupProps> = ({ tags, isTagFilled, tagIcon, onTagClick }) => {
  return (
    <div className={styles.CellGroup}>
      {tags.map(tag => (
        <Cell 
          key={tag}
          tag={tag}
          onTagClick={(tag) => onTagClick && onTagClick(tag)}
          isFilled={isTagFilled?.[tag] || false}
          icon={tagIcon?.[tag] || 'empty'}
        />
      ))}
    </div>
  );
}

export default CellGroup;
