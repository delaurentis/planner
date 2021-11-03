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
  const width = Math.round(994 / 224 * (props.height || 28));

  return (
    <div><b>Planner</b></div>
  );
};

export default PlannerLogo;
