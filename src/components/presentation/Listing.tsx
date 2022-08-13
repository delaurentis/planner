import React, { useState, useRef, useCallback, useEffect } from 'react';
import Chip from './Chip';
import Button from './Button';
import Actions from './Actions';
import OptionChips from './OptionChips';
import Radio from './Radio';
import KeyWatcher from './KeyWatcher';
import IconX from '../icons/IconX';
import { Option as OptionType, 
         Label as LabelType,
         Action as ActionType,
         Environment as EnvironmentType } from 'data/types';
import { CATEGORY_FEATURE, CATEGORY_BUG } from 'data/categories';
import styles from './Listing.module.css';
import { environments } from 'data/environments';

interface ListingProps {
  actions?: ActionType[];
  icon?: string;
  title?: string;
  url?: string;
  category?: string;
  placeholder?: string;
  labels?: LabelType[];
  extra?: React.ReactNode;
  extras?: React.ReactNode[];
  isShowingActions?: boolean;
  isHighlighted?: boolean;
  isDimmed?: Boolean;
  isNew?: boolean;
  isEditing?: boolean;
  entity?: any;
  defaultCategory?: string;
  focusRequestedAt?: number;
  onShowActions?(shouldShow: boolean): void;
  onUpdate?(update: any, entity?: any): void;
  onKey?(key: string, entity?: any): boolean;
  onFocus?(): void;
  onBlur?(): void;
}

const Listing: React.FC<ListingProps> = (props) => {

  // Handle showing + hiding of actions strip
  const handleIconClick = () => { props.onShowActions?.(!props.isShowingActions); }

  // Accept clicks on actions + trigger an update to the issue
  const handleActionClick = (action: ActionType) => {
    if ( props.entity && props.onUpdate ) {
      props.onUpdate(action.update, props.entity);
    }
    props.onShowActions?.(false);
  }

  // Setup editing
  const [editedTitle, setEditedTitle] = useState((props.title) || '');
  const handleChangeTitle = (event: any) => {
    setEditedTitle(event.target.value);
  }

  // Put focus onto the input if you click the plus sign
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClickPlus = () => {
    inputRef?.current?.focus();
  }

  // Make inputs not editable until a beat after created
  // so we don't default to focus on the bottom most one created
  const [isEditable, setEditable] = useState(false);
  useEffect(() => { 
    if ( props.isEditing ) {
      setEditable(true);
    }
  }, [props.isEditing]);

  // When the focus epoc is upgraded, we'll focus on the input
  useEffect(() => {
    if ( props.focusRequestedAt && props.focusRequestedAt > 0 ) {
      console.log('Focus requested at', props.focusRequestedAt);
      inputRef?.current?.focus();
      inputRef?.current?.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
    }
  }, [props.focusRequestedAt]);

  // They clicked to create a new issue
  const handleClickCreate = () => {
    if ( props.onUpdate ) {
      props.onUpdate({ title: editedTitle, description: '', meta: { category: issueCategory, environment: issueEnvironment } });
    }
    setEditedTitle('');
    setIssueEnvironment(undefined);
  }

  // The clicked the issue category radio
  const [issueCategory, setIssueCategory] = useState(props.defaultCategory || CATEGORY_FEATURE)
  const handleClickCategory = (newAnswer: string) => {
    setIssueCategory(newAnswer);
  }

  // When the user is moused over a listing, accept keyboard shortcuts
  const handleKey = (key: string) => { props.onKey?.(key, props.entity) }

  // Handle key presses on the input
  const handleInputKeyPress = (event: any) => {
    if ( event.key === 'Enter' ) {
      handleClickCreate();
      inputRef.current?.blur();
    }
    else if ( event.key === 'Escape' ) {
      setEditedTitle('');
      inputRef.current?.blur();
    }
  };

  // We're going to lock keyboard events to this input
  // by passing 'true' for useCapture (3rd argument below)
  const handleInputFocus = () => { props.onFocus?.();  }
  const handleInputBlur = () => {  props.onBlur?.(); }

  // For bugs we'll prompt for environment
  const [issueEnvironment, setIssueEnvironment] = useState<EnvironmentType>();

  // These can change as we go
  const divProps = { highlighted: `${props.isHighlighted}`, new: `${props.isNew}`, dimmed: `${props.isDimmed}`, actions: `${props.isShowingActions}` };

  // Figure out what to put on the right column
  const extra = () => {
    if ( props.extras ) {
      return <span className={styles.Extra}>
        { props.extras.map((extra: React.ReactNode, index: number) => {
            return <span className={styles.ExtraChild} key={index}>{extra}</span>
          })
        }
      </span>
    }
    else if ( props.extra ) {
      return <span className={styles.Extra}>{ props.extra }</span>
    }
    else {

      // Label chips are the default extra
      return (<span className={styles.Chips}>
        {
          props.labels?.map((label: LabelType) => 
            <Chip url={label.url} key={label.name}>
              {label.icon} {label.name}
            </Chip>
          )
        }
      </span>);      
    }
  }

  // We have two main states of our issue row, 
  // showing the listing, or showing actions
  if ( props.isShowingActions ) {
    return (<KeyWatcher onKey={handleKey}>
              <div className={styles.Listing} {...divProps}>
                <span className={styles.IconAndTitle}>
                  <span className={styles.Close} onClick={handleIconClick} title="Click to close or press Escape">
                    <IconX width='1.2em' height='1.2em'/>
                  </span>
                  <Actions actions={props.actions || []} onClickAction={handleActionClick}/>
                </span>
              </div>
            </KeyWatcher>);
  }
  else {

    // If we're editing this one
    if ( props.isEditing ) {

      // Should we display a button
      const button = () => {
        if ( editedTitle && editedTitle.length > 0 ) {
          return <Button isSmall={true} 
                         title='Create'
                         onClick={handleClickCreate}/>
        } 
        return undefined;
      }

      // This lets us say what kind of issue it is when creating
      const radio = () => {
        if ( editedTitle && editedTitle.length > 0 ) {
          return <Radio answers={[CATEGORY_FEATURE, CATEGORY_BUG]}
                        selectedAnswer={issueCategory}
                        onClickRadio={handleClickCategory}/>
        }
        else {
          return undefined;
        }
      }

      // Optionall,y we may show environments
      const environmentOptions = () => {
        if ( editedTitle && editedTitle.length > 0 && issueCategory === CATEGORY_BUG ) {

          const options: OptionType[] = environments.map((environment: EnvironmentType) => {
            return { title: environment.icon,
                     name: environment.icon, 
                     isSelected: (issueEnvironment?.name === environment.name), 
                     isSelectable: true,
                     isIconOnly: true,
                     isExpandable: false, 
                     onSelectOption: () => { setIssueEnvironment(environment); } };
          });

          return <span className={styles.EnvironmentOptions}><OptionChips options={[options]}/></span>;
        }
        else {
          return undefined;
        }
      };

      // Optionally show extras if we're not editing
      const editingExtra = () => {
        if ( !editedTitle?.length ) {
          return extra();
        }
        return undefined;
      };

      // Custom input attributes
      const inputAttributes = () => {
        if ( isEditable ) {
          return undefined;
        }
        else {
          return { disabled: true }
        }
      }

      return (
        <div className={styles.Listing} {...{ blank: 'true' }} >
          <span className={styles.IconAndTitle}>
            <span 
              className={styles.Icon} 
              onClick={handleClickPlus}
              title='Press n click to create a new issue'
            >
              ➕
            </span>
            <input className={styles.Input}
                  ref={inputRef}
                  placeholder={props.placeholder}
                  value={editedTitle}
                  onChange={handleChangeTitle}
                  onKeyUp={handleInputKeyPress}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  {...inputAttributes()}
            />
            <span className={styles.Radio}>
              {environmentOptions()}
              {radio()}
            </span>
            <span className={styles.Button}>
              {button()}
            </span>
          </span>
          {editingExtra()}
        </div>
      );
    }
    else {

      // This is our standard listing
      return (<KeyWatcher onKey={handleKey}>
                <div className={styles.Listing} {...divProps}>
                  <span className={styles.IconAndTitle}>
                    <span className={styles.Icon} title={`Press a or click for actions`} onClick={handleIconClick}>{props.icon}</span>
                    <a className={styles.Link} href={props.url} target='_blank' rel='noopener noreferrer'>{props.title}</a>
                  </span>
                  {extra()}
                </div>
              </KeyWatcher>);
    }
  }
}

export default Listing;
