import React from 'react';
import { IconProps } from './types';

const IconEpics: React.FC<IconProps> = props => (
  <svg 
    {...props} 
    aria-labelledby='epics'
    role='img'
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 25 25">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.2142 4.5C16.73 3.04487 18.1202 2 19.75 2C21.8179 2 23.5 3.68208 23.5 5.75C23.5 7.81792 21.8179 9.5 19.75 9.5C18.1396 9.5 16.7631 8.47983 16.2329 7.05172H6.02769C5.00408 7.05172 4.11538 7.95214 4.11538 9.12655C4.11538 10.3267 5.00684 11.2241 6.02769 11.2241H18.9723C21.4804 11.2241 23.5 13.3112 23.5 15.8507C23.5 18.4111 21.4822 20.5 18.9723 20.5H8.78584C8.26998 21.9551 6.87983 23 5.25 23C3.18208 23 1.5 21.3179 1.5 19.25C1.5 17.1821 3.18208 15.5 5.25 15.5C6.86045 15.5 8.23689 16.5202 8.76708 17.9483H18.9723C19.9959 17.9483 20.8846 17.0479 20.8846 15.8734C20.8846 14.6733 19.9932 13.7759 18.9723 13.7759H6.02769C3.51955 13.7759 1.5 11.6888 1.5 9.14931C1.5 6.58892 3.51778 4.5 6.02769 4.5H16.2142ZM18.1154 5.75C18.1154 6.65116 18.8488 7.38462 19.75 7.38462C20.6512 7.38462 21.3846 6.65116 21.3846 5.75C21.3846 4.84884 20.6512 4.11538 19.75 4.11538C18.8488 4.11538 18.1154 4.84884 18.1154 5.75ZM5.25 20.8846C4.34884 20.8846 3.61538 20.1512 3.61538 19.25C3.61538 18.3488 4.34884 17.6154 5.25 17.6154C6.15116 17.6154 6.88462 18.3488 6.88462 19.25C6.88462 20.1512 6.15116 20.8846 5.25 20.8846Z"/>
    </svg>
);

export default IconEpics;
