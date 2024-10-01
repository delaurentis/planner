import React from 'react';
import CellGroup from './CellGroup';
import CellSeparator from './CellSeparator';
import styles from './CellGroups.module.css';

interface CellGroupsProps {
  tags: string[][];
  isTagFilled: { [key: string]: boolean };
  tagIcon: { [key: string]: string };
  onTagClick?(tag: string): void;
}

const CellGroups: React.FC<CellGroupsProps> = ({ tags, isTagFilled, tagIcon, onTagClick }) => {
  return (
    <div className={styles.CellGroups}>
      {tags.map((tagsInGroup, index) => (
        <React.Fragment key={index}>
          <CellGroup 
            tags={tagsInGroup}
            onTagClick={(tag) => onTagClick && onTagClick(tag)}
            isTagFilled={isTagFilled}
            tagIcon={tagIcon}
          />
          {index !== tags.length - 1 && <CellSeparator />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default CellGroups;
