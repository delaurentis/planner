import React from 'react';

interface PlannerLogoProps {
  height?: number;
}

const PlannerLogo: React.FC<PlannerLogoProps> = ({ height = 28, ...props }) => {
  const width = Math.round(267 / 40 * height);
  return (
    <span>Planner</span>
  );
};

export default PlannerLogo;
