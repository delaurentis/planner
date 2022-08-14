import React from 'react';
import styles from './DetailPane.module.css';
import Button from './Button';

interface DetailPaneProps {
  title: string;
  titleUrl: string;
  titleTip?: string;
  subtitle?: string;
  icon?: string;
  isLoading?: boolean;
  isEditing?: boolean;
  onSave?: () => void;
  onEditing?: (editing: boolean) => void;
  children: React.ReactNode;
}

const DetailPane: React.FC<DetailPaneProps> = (props: DetailPaneProps)  => {

  // Button is different depending on state
  const button = () => {
    if ( props.isEditing ) {
      return (
        <span className={styles.DetailButtons}>
          <Button title='Cancel' size='medium' isSecondary={true} onClick={() => { props.onEditing?.(false) }}/>
          <Button title='Save' size='medium' onClick={() => { props.onSave?.() }}/>
        </span>
      )
    }
    else {
      return <Button title='Edit' size='medium' isSecondary={true} onClick={() => { props.onEditing?.(true) }}/>
    }
  }

  // Render our HTML
  return (
    <div className={styles.DetailPane}>
      <div className={styles.DetailTitle}>
        <div className={styles.DetailTitleColumns}>
          <span className={styles.DetailLinkContainer}>
            <span className={styles.DetailIcon}>{props.icon}</span>
            <a href={props.titleUrl} target='_blank' rel='noreferrer' title={props.titleTip}>
              {props.title}
            </a>
            <span className={styles.DetailSubtitle}>{props.subtitle}</span>
          </span>
          <span className={styles.DetailButton}>{button()}</span>
        </div>
      </div>
      <div className={styles.DetailContent}>{props.children}</div>
    </div>
  )
}

export default DetailPane;