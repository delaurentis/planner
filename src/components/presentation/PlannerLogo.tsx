import React from 'react';

interface PlannerLogoProps {
  height?: number;
}

const PlannerLogo: React.FC<PlannerLogoProps> = ({ height = 28, ...props }) => {
  return (
    <span>Planner</span>
  );
};

export default PlannerLogo;
