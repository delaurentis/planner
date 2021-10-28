import React from 'react';
import { IconProps } from './iconTypes';

const IconCaretUp: React.FC<IconProps> = props => (
  <svg
    {...props}
    aria-labelledby='icon_caret_up'
    role='img'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 320 512'>
    <title id='icon_caret_up'>Caret up icon</title>
    <path fill='currentColor' d='M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z'/>
  </svg>
);

export default IconCaretUp;
