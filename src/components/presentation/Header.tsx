import React, { useEffect, useState } from 'react';
import PlannerLogo from '../presentation/PlannerLogo';

import styles from './Header.module.css';

interface HeaderProps {
  isLogoPermanent?: boolean;
}

const Header: React.FC<HeaderProps> = (props) => {
  
  // Hide the logo after a few seconds
  const [isLogoHiding, setLogoHiding] = useState(false);

  // Run the first time
  useEffect(() => {
    if ( !props.isLogoPermanent ) {
      setTimeout(() => setLogoHiding(true), 2000);
    }
  }, [props.isLogoPermanent])

  // Should we hide the logo?
  const hidingProps = () => {
    // If we're in an iFrame, never show the logo
    const isInIFrame = window.location !== window.parent.location;
    if ( isInIFrame || isLogoHiding ) { 
      return { hiding: 'true' };
    }
    return {};
  }

  return (
    <div className={styles.Header}>
      <span className={styles.HeaderLogo} {...hidingProps()} ><PlannerLogo height={42}/></span>
      <span className={styles.HeaderContent}>{props.children}</span>
    </div>
  );

}

export default Header;


