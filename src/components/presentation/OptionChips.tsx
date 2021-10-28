import React from 'react';
import OptionChip from './OptionChip';
import styles from './OptionChips.module.css';

import { Option } from 'data/types';

interface OptionChipsProps {
  options: Option[][]
}

const OptionChips: React.FC<OptionChipsProps> = (props) => {
  return (
    <span className={styles.OptionChips}>
      { props.options.map((group, index) => 
          <span key={`optionGroup${index}`} className={props.options.length > 1 ? styles.OptionChipGroup : styles.SoloOptionChipGroup}>
            { group.map((option: Option, index: number) => 
                <OptionChip key={option.name} option={option}/>
            )}
          </span>)
      }
    </span>
  );
}

export default OptionChips;