import React from 'react';
import Users from './Users';
import { milestoneFromTitle } from 'data/milestones';
import { Filter, Epic, MilestoneLibrary } from 'data/types';

interface MilestoneProps {
  filter: Filter;
  milestones: MilestoneLibrary;
  epics?: Epic[];
  isHiddenWhenEmpty?: boolean;
}

// TODO: We used to do a lot more in this component, but have consolidated a good bit of the work outside
// It may make sense to deprecate this component in the future, or fuse it with users
const Milestone: React.FC<MilestoneProps> = (props: MilestoneProps) => {
  
  // Find the right milestone from the library to match the filter, and if it's not there, use the title
  const milestone = milestoneFromTitle(props.filter.milestone, props.milestones);
  
  // Render our users
  return <Users filter={props.filter} 
                milestone={milestone} 
                milestones={props.milestones}
                epics={props.epics}
                isHiddenWhenEmpty={props.isHiddenWhenEmpty}/>;
}

export default Milestone;
