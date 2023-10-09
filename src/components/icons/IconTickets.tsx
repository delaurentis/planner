import React from 'react';
import { IconProps } from './types';

const IconTickets: React.FC<IconProps> = props => (
  <svg
    {...props}
    aria-labelledby='code'
    role='img'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 22 22'>
    <g>
      <path d="M19.6357 5.38235C19.15 4.87255 18.4214 4.87255 17.9357 5.38235L8.82857 14.9412L5.06429 10.9902C4.57857 10.4804 3.85 10.4804 3.36429 10.9902C2.87857 11.5 2.87857 12.2647 3.36429 12.7745L7.97857 17.6176C8.22143 17.8725 8.46429 18 8.82857 18C9.19286 18 9.43571 17.8725 9.67857 17.6176L19.6357 7.16667C20.1214 6.65686 20.1214 5.89216 19.6357 5.38235Z"/>
    </g>
  </svg>
);

export default IconTickets;
