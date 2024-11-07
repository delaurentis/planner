import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  isInverted?: number;
}

const Logo: React.FC<LogoProps> = ({ height = 28, isInverted = false, ...props }) => {
  const color = isInverted ? '#fff' : '#7E57FF';
  const width = Math.round(993 / 161 * (height || 28));

  return (
    <svg
      height={`${height}px`}
      width={`${width}px`}
      aria-labelledby='logo_planner'
      viewBox='0 0 993 161'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <title id='logo_planner'>Planner</title>
      <desc>Planner logo</desc>
      <g clipPath='url(#clip0)'>
      </g>
      <defs>
        <clipPath id='clip0'>
          <rect x='0.860107' width='992' height='161' fill='white'/>
        </clipPath>
      </defs>
    </svg>
  );
};

export default Logo;
