import React, { useEffect, useState, useRef } from 'react';
import styles from './AutoComplete.module.css';
import { Option, OptionChoice } from 'data/types';
import Menu from './Menu';

interface AutoCompleteProps {
  title: string;
  text?: string;
  subtitle: React.ReactNode;
  placeholder: string;
  option: Option;
  onCancel?(): void;
}

const AutoComplete: React.FC<AutoCompleteProps> = (props) => {
  
  // Setup editing
  const [editedText, setEditedText] = useState('');
  const handleChangeText = (event: any) => {
    setEditedText(event.target.value);
  }

  // When they click the menu, find the right option
  const handleClickMenuItem = (item: string) => {
    const value: OptionChoice | undefined = props.option.choices?.find(choice => choice.title === item);
    props.option.onSelectOption?.(props.option, value);

    // Clear it out for next time
    setEditedText('');
  }

  // Filter our options based on the text
  const matchingOptions: OptionChoice[] | undefined = props.option.choices?.filter(
    (choice: OptionChoice) => !editedText || choice.title.toLowerCase().includes(editedText.toLowerCase())
  );

  // Detect enter key
  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      if ( matchingOptions?.length ) {
        props.option.onSelectOption?.(props.option, matchingOptions?.[0]);
        setEditedText('');
      }
    }
    else if (event.keyCode === 27) {
      props.onCancel?.();
    }
  }

  // Compute our subtitle (optional)
  const subtitle = () => {
    if ( props.subtitle ) {
      return <div className={styles.Subtitle}>{props.subtitle}</div>;
    }
    return undefined;
  }

  // Auto focus on startup
  const inputRef: any = useRef();
  useEffect(() => {
    setTimeout(() => inputRef?.current?.focus?.(), 100);
  });

  return (
    <div className={styles.AutoComplete}>
      <div className={styles.Title}><h2>{props.title}</h2></div>
      {subtitle()}
      <input ref={inputRef}
             className={styles.Input} 
             placeholder={props.placeholder}
             value={editedText}
             onChange={handleChangeText}
             onKeyDown={handleKeyDown}/>
      <div className={styles.Content} {...{subtitled: `${!!props.subtitle}`}}>
        <Menu items={matchingOptions?.map((choice: OptionChoice) => choice.title) || []}
              onClickItem={handleClickMenuItem}
              isWide={true}/>
      </div>
    </div>
  );
}

export default AutoComplete;
