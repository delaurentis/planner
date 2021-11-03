import React, { useState, useRef } from 'react';
import Chip from './Chip';
import Button from './Button';
import Actions from './Actions';
import OptionChips from './OptionChips';
import Radio from './Radio';
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
  isHighlighted?: boolean;
  isNew?: boolean;
  isEditing?: boolean;
  entity?: any;
  defaultCategory?: string;
  onUpdate?(update: any, entity?: any): void;
}

const Listing: React.FC<ListingProps> = (props) => {

  // Handle showing + hiding of actions strip
  const [showActions, setShowActions] = useState(false);
  const handleIconClick = () => { setShowActions(!showActions); }

  // Accept clicks on actions + trigger an update to the issue
  const handleActionClick = (action: ActionType) => {
    if ( props.entity && props.onUpdate ) {
      props.onUpdate(action.update, props.entity);
    }
    setShowActions(false);
  }

  // Setup editing
  const [editedTitle, setEditedTitle] = useState((props.title) || '');
  const handleChangeTitle = (event: any) => {
    setEditedTitle(event.target.value);
  }

  // Detect enter key
  const handleKeyDown = (event: any) => {
    // TODO: Add enter key handling
  }

  // Put focus onto the input if you click the plus sign
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClickPlus = () => {
    inputRef?.current?.focus();
  }

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

  // For bugs we'll prompt for environment
  const [issueEnvironment, setIssueEnvironment] = useState<EnvironmentType>();

  // These can change as we go
  const divProps = { highlighted: `${props.isHighlighted}`, new: `${props.isNew}` };

  // We have two main states of our issue row, 
  // showing the listing, or showing actions
  if ( showActions ) {
    return (<div className={styles.Listing} {...divProps}>
              <span className={styles.IconAndTitle}>
                <span className={styles.Close} onClick={handleIconClick}>
                  <IconX width='1.2em' height='1.2em'/>
                </span>
                <Actions actions={props.actions || []} onClickAction={handleActionClick}/>
              </span>
            </div>);
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
        
      return (<div className={styles.Listing}>
        <span className={styles.IconAndTitle}>
          <span className={styles.Icon} onClick={handleClickPlus}>➕</span>
          <input className={styles.Input}
                 ref={inputRef}
                 placeholder={props.placeholder}
                 value={editedTitle}
                 onChange={handleChangeTitle}
                 onKeyDown={handleKeyDown}/>
          <span className={styles.Radio}>
            {environmentOptions()}
            {radio()}
          </span>
          <span className={styles.Button}>
            {button()}
          </span>
        </span>
      </div>);
    }
    else {

      // Figure out what to put on the right column
      const extra = () => {
        if ( props.extra ) {
          return <span className={styles.Extra}>{ props.extra }</span>
        }
        else {

          // Label chips are the default extra
          return (<span className={styles.Chips}>
            {
              props.labels?.map((label: LabelType) => 
                <Chip url={label.url}>
                  {label.icon} {label.name}
                </Chip>
              )
            }
          </span>);      
        }
      }

      return (<div className={styles.Listing} {...divProps}>
                <span className={styles.IconAndTitle}>
                  <span className={styles.Icon} onClick={handleIconClick}>{props.icon}</span>
                  <a className={styles.Link} href={props.url} target='_blank' rel='noopener noreferrer'>{props.title}</a>
                </span>
                {extra()}
              </div>);
    }
  }
}

export default Listing;
