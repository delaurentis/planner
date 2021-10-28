import React, { useEffect, useState } from 'react';
import IconX from '../icons/IconX';
import styles from './Panes.module.css';

interface PanesProps {
  top?: React.ReactNode;
  bottom?: React.ReactNode;
}

const Panes: React.FC<PanesProps> = (props: PanesProps) => {

  // We load the same pane in an iframe
  const port = window.location.port && `:${window.location.port}`;
  const baseUrl = `${window.location.protocol}//${window.location.hostname}${port}`;

  const [isSplit, setSplit] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSplit(true);
    }, 2000);
  }, []);

  // This triggers animation of the split view going up / down
  const splitProps = {split: isSplit ? 'true' : 'false'};

  // Close the panel
  const handleCloseClick = () => {
    setSplit(false);
  }

  // Return an optional iFrame if they want a split view
  const bottomPane = () => {
    const isNotIFrameAlready = window.location === window.parent.location;
    if ( isNotIFrameAlready ) {	
      return (
        <div className={styles.BottomPane} { ...splitProps }>
          <div className={styles.PaneContent}>
            {isSplit ? props.bottom : undefined}
            <span className={styles.BottomClose} onClick={handleCloseClick}>
              <IconX width='1.2em' height='1.2em'/>
            </span>
          </div>
        </div>
      );
    }
    return <div/>;
  }
  
  // Create our apollo client which manages all local and remote state
  return (
    <div>
      <div className={styles.TopPane} { ...splitProps }>
        <div className={styles.PaneContent}>
          {props.top}
        </div>
      </div>
      {bottomPane()}
    </div>
  );
}

export default Panes;