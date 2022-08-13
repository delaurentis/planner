import React from 'react';
import styles from './Card.module.css';
import OptionChip from './OptionChip';
import { Option } from 'data/types';
import KeyWatcher from 'components/presentation/KeyWatcher';

interface CardProps {
  title: string;
  subtitle?: string;
  titleUrl: string;
  isLoading: boolean;
  children: React.ReactNode;
  option?: Option;
  icon?: string;
  iconTip?: string;
  onClickIcon?(): void;
  onKey?(key: string): void;
}

const Card: React.FC<CardProps> = (props: CardProps)  => {

  // Optional clickable icon
  const cardIcon = () => {
    if ( props.icon ) {
      return (
        <span 
          className={styles.CardIcon} 
          title={props.iconTip}
          onClick={() => { props.onClickIcon?.() }}>
          {props.icon}
        </span>
      )
    }
    return undefined
  }
  
  // Optional far right column with selectable column type
  const cardOption = () => {
    if ( props.option ) {
      return (<span className={styles.CardOption}>
        <OptionChip option={props.option}/>
      </span>);
    }
    else {
      return <span/>
    }
  }

  // Render our HTML
  return <KeyWatcher className={styles.Card} onKey={props.onKey}>
            <div className={styles.CardHeader}>
              <div className={styles.CardTitles}>
                {cardIcon()}
                <a href={props.titleUrl} target='_blank' rel='noopener noreferrer' className={styles.CardLink}>
                  {props.title}
                </a>
                <span className={styles.CardSubtitle}>{props.subtitle}</span>
              </div>
              {cardOption()}
            </div>
            <div {...{ loading: `${props.isLoading}`}} className={styles.CardContent}>
              {props.children}
            </div>
         </KeyWatcher>;
}

export default Card;