import React from 'react';
import FilterBar from '../presentation/FilterBar';
import Arena from '../presentation/Arena';
import Header from '../presentation/Header';
import Milestone from './Milestone';
import { teams } from 'data/teams';
import { upcomingMilestones, recentMilestones, currentMilestone } from 'data/milestones';
import { Filter, FilterReadouts, Team } from 'data/types';
import { FILTER, OPEN_UNASSIGNED_ISSUES, OPEN_EPICS, ALL_BUG_ISSUES } from 'data/queries';
import { useQuery, useApolloClient } from '@apollo/client';
import { polling } from 'data/polling';

interface PlannerProps {
}

const Planner: React.FC<PlannerProps> = (props: PlannerProps) => {
  
  // Show the current filter
  const filterQuery = useQuery(FILTER);
  const filter: Filter = filterQuery.data?.filter;
  
  // Update the globally accessible filter
  const client = useApolloClient();
  const handleChangeFilter = (filter: Filter) => {
    client.writeQuery({ query: FILTER, data: { filter: filter } });
  }

  // What milestone names should we query?
  /*const milestoneNames = (): string[] => {
    if ( filter.milestone === 'All' ) {
      return upcomingMilestones;
    }
    return [filter.milestone];
  }*/

  // TODO: I put this up here so we could always have the unassigned count
  // but am not thrilled about it.  I'd like to move this logic elsewhere
  //
  // If we have a milestone, we want to do another query to get # of unassigned issues
  // Figure out our variables for the query
  // We'll use the team to display a list, but even if it's just one, we'll use it to get the right labels
  const team: Team | undefined = filter.team ? teams[filter.team] : undefined;
  
  const unassignedQuery = useQuery(OPEN_UNASSIGNED_ISSUES, { 
    pollInterval: polling.frequency.unassignedIssueCount, 
    variables: { username: 'none', milestones: [currentMilestone], labels: team?.labels } });
  
  const bugQuery = useQuery(ALL_BUG_ISSUES, { 
    pollInterval: polling.frequency.bugCount, 
    variables: { milestones: [currentMilestone], labels: [...team?.labels || [], '🐞 Bug'] } });

  const countQueryResults = (query, state: string | undefined = undefined) => {
    const nodes = query.data?.group?.issues?.nodes || [];
    if ( state ) {
      return nodes.filter(node => node.state === state).length;
    }
    else {
      return nodes.length;
    }
  }

  const filterReadouts = (): FilterReadouts => {
    return { unassignedIssueCount: countQueryResults(unassignedQuery),
             fixedBugCount: countQueryResults(bugQuery, 'closed'),
             openBugCount: countQueryResults(bugQuery, 'opened') }      
  }

  // Get a list of epics (don't refresh as we go at the moment)
  const epicsQuery = useQuery(OPEN_EPICS, { variables: { labels: team?.labels }});
  const epics = epicsQuery.data?.group?.epics?.nodes || [];

  // Create our milestones based on the filter - if it's All, include multiple
  const milestones = (): React.ReactNode => {
    if ( filter.milestone === 'All' && 
         filter.username !== 'diffs' && 
         filter.username !== 'links' ) {
      return <div>
        {recentMilestones.map((milestoneName: string) => {
          return <Milestone key={`Milestone${milestoneName}`} filter={{ ...filter, milestone: milestoneName }} epics={epics} isHiddenWhenEmpty={true}/>
        })}
        {upcomingMilestones.map((milestoneName: string) => {
          return <Milestone key={`Milestone${milestoneName}`} filter={{ ...filter, milestone: milestoneName }} epics={epics}/>
        })}
        <Milestone key="MilestoneNone" filter={{ ...filter, milestone: "none" }} epics={epics}/>
        <Milestone key="MilestoneBacklog" filter={{ ...filter, milestone: "Backlog" }} epics={epics}/>
      </div>
    }
    return <Milestone filter={filter} epics={epics}/>
  }

  return (
    <div>
      <Header>
        <FilterBar filter={filter} 
                   readouts={filterReadouts()} 
                   onChangeFilter={handleChangeFilter}/>
      </Header>
      <Arena>
        {milestones()}
      </Arena>
    </div>
  );

}

export default Planner;
