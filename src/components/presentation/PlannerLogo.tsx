import React from 'react';

interface PlannerLogoProps {
  width?: number;
  height?: number;
}

const defaultProps = {
  height: 28,
  isInverted: false
};

const PlannerLogo: React.FC<PlannerLogoProps> = (props) => {
  const width = Math.round(267 / 40 * (props.height || 28));
  return (
    <span>Planner</span>
  );
};

export default PlannerLogo;
