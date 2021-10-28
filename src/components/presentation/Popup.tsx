import React, { useState, useEffect } from 'react';
import Shade from './Shade';
import styles from './Popup.module.css';
import IconX from '../icons/IconX';

interface PopupProps {
  children?: React.ReactNode;
  onClosePopup?(): void;
}

const Popup: React.FC<PopupProps> = (props) => {

  const [isShowing, setShowing] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setShowing(true), 50);
  });

  const optionalClasses = isShowing ? [styles.PopupShowing] : [];

  return (
    <div className={[styles.Popup, ...optionalClasses].join(' ')}>
      <Shade onClick={() => props.onClosePopup?.()}/>
      <div className={styles.PopupCard}>
        {props.children}
        <div className={styles.CloseButton} onClick={() => props.onClosePopup?.()}>
          <IconX width='2em' height='2em'/>
        </div>
      </div>
    </div>

  );
}

export default Popup;