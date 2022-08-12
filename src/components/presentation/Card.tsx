import React from 'react';
import styles from './Card.module.css';
import OptionChip from './OptionChip';
import { Option, OptionChoice } from 'data/types';

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
  return <div className={styles.Card}>
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
          </div>;
}

export default Card;