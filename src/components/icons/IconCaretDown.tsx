import React from 'react';
import { IconProps } from './iconTypes';

const IconCaretDown: React.FC<IconProps> = props => (
  <svg
    {...props}
    aria-labelledby='icon_caret_down'
    role='img'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 320 512'>
    <title id='icon_caret_down'>Caret down icon</title>
    <path fill='currentColor' d='M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z'/>
  </svg>
);

export default IconCaretDown;
