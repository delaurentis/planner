import React, { useState, useRef } from 'react';
import Icon from '../icons/Icon';
import styles from './Avatar.module.css';

interface AvatarProps {
  imageUrl?: string;
  name?: string;
  username?: string;
  initials?: string;
  onClick?: () => void;
  isDimmed?: boolean;
  isMe?: boolean;
}

const Avatar: React.FC<AvatarProps> = (props) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowTooltip(false);
  };

  if (!props.username) {
    return (
      <div className={styles.Container}>
        <div 
          className={`${styles.Image} ${styles.Unassigned}`}
          onClick={props.onClick}
          title="Unassigned"
        >
          ?
        </div>
        <div 
          className={`${styles.Overlay} ${styles.UnassignedOverlay}`}
          onClick={props.onClick}
        >
          ?
        </div>
      </div>
    );
  }

  return (
    <div 
      className={styles.Container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-dimmed={props.isDimmed}
    >
      {props.isMe ? (
        <Icon 
          fill='rgba(0,0,0,0.1)'
          name="person"
          className={styles.Image}
        />
      ) : (
        <img 
          onClick={props.onClick}
          src={props.imageUrl} 
          alt={props.username} 
          title={props.username}
          className={styles.Image} 
        />
      )}
      <div 
        className={styles.Overlay}
        onClick={props.onClick}
      >
        {props.initials}
      </div>
      {showTooltip && (
        <div className={styles.Tooltip}>
          {props.name}
        </div>
      )}
    </div>
  );
}

export default Avatar;