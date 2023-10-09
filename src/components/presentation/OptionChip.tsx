import React, { useState, useEffect } from 'react';
import Caret from './Caret';
import Menu from './Menu';
import styles from './OptionChip.module.css';
import { Option, OptionChoice } from 'data/types';
import Dropdown from './Dropdown';
import Icon from '../icons/Icon';

export interface OptionChipProps {
  option: Option
}

const OptionChip: React.FC<OptionChipProps> = (props) => {

  // We want to keep state locally while it syncs with the server
  const [isSelected, setSelected] = useState(props.option.isSelected);

  // If the scheduled value changes in a remote update, 
  // make sure to overwrite our local cached version
  useEffect(() => {
    setSelected(props.option.isSelected);
  }, [props.option.isSelected]);

  const handleClick = () => {
    if ( props.option.isExpandable ) {

      // Toggle expanded state
      setExpanded(!isExpanded);
    }
    else if ( props.option.onSelectOption ) {

      // Update local state immediately, and hold until there is an outside change
      if ( props.option.isToggleable ) {
        setSelected(!isSelected);
      }
      else {
        setSelected(true);
      }

      // Just note that the option was selected
      props.option.onSelectOption?.(props.option)
    }
  }

  const handleClickMenuItem = (item: string) => {
    const value: OptionChoice | undefined = props.option.choices?.find(choice => choice.title === item);
    props.option.onSelectOption?.(props.option, value);
  }

  const [isExpanded, setExpanded] = useState(props.option.isExpanded || false);
  const caretDirection = (props.option.isExpandable && !props.option.isAutoComplete) ? 
                         (isExpanded ? 'up' : 'down') : 
                         undefined;

  const menu = (): React.ReactNode => {
    if ( isExpanded && props.option.choices ) {
      const maxChoiceCharacters: number = props.option.choices.reduce((max: number, choice: OptionChoice) =>
      { 
        if ( choice.title.length > max ) {
          return choice.title.length;
        }
        return max;
      }, 0);

      // Put together our menu
      return (
        <Dropdown>
          <Menu items={props.option.choices.map((choice: OptionChoice) => choice.title)}
                onClickItem={handleClickMenuItem}/>
        </Dropdown>
      );

    }
    return <span/>;
  }


  const optionalStyles = { isselected: `${props.option.isToggleable ? isSelected : props.option.isSelected}`, 
                           istoggleable: `${props.option.isToggleable}`, 
                           isselectable: `${props.option.isSelectable}`,
                           isblank: `${props.option.isBlank}`,
                           issmall: `${props.option.isSmall}`,
                           isiconic: `${props.option.isIconOnly}`,
                           isdimmable: `${props.option.isDimmable}`,
                           isradio: `${props.option.isRadio}`,
                           ismultiselectable: `${props.option.isMultiSelectable}`,};

  return (
    <span className={styles.Chip} { ...optionalStyles } onClick={handleClick}>
      <span title={props.option.tip}>
        {props.option.icon && <span className={styles.ChipIcon}><Icon name={props.option.icon} fill="currentColor" width="22" height="22"/></span>}
        {props.option.title && <span>{props.option.title}</span>}
        <span><Caret caret={caretDirection}/></span>
      </span>
      {menu()}
    </span>
  );
}

export default OptionChip;
