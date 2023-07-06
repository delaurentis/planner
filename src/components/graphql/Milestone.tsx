import React from 'react';
import Users from './Users';
import { Filter, Epic } from 'data/types';
import { MILESTONES } from 'data/queries';
import { useQuery } from '@apollo/client';
import { organization } from 'data/customize';

interface MilestoneProps {
  filter: Filter;
  epics?: Epic[];
  isHiddenWhenEmpty?: boolean;
}

const Milestone: React.FC<MilestoneProps> = (props: MilestoneProps) => {
  
  // We need a milestone ID for the API call
  // so this is a two stage loading process, where first we get the milestone
  // and then we'll filter the content below based on the milestone
  const milestonesQuery = useQuery(MILESTONES, { variables: { groupPath: organization } });
  const milestoneFromQuery = () => {
    const milestoneTitle = props.filter.milestone;
    if ( milestonesQuery.data?.group ) {
      const milestoneNodes = milestonesQuery.data.group.milestones.nodes;
      const milestoneFound = milestoneNodes.find((milestone: any) => milestone.title === milestoneTitle);
      if ( milestoneFound ) {

        // It returns an ID with a long string form and we need to extract the # to work with the REST api
        return { title: milestoneFound.title, 
                 id: parseInt(milestoneFound.id.split('/').slice(-1)[0]), 
                 startDate: milestoneFound.startDate, 
                 dueDate: milestoneFound.dueDate };
      }
    }
    return { title: milestoneTitle };
  }

  return <Users filter={props.filter} 
                milestone={milestoneFromQuery()} 
                milestones={milestonesQuery.data?.group?.milestones?.nodes}
                epics={props.epics}
                isHiddenWhenEmpty={props.isHiddenWhenEmpty}/>;
}

export default Milestone;
