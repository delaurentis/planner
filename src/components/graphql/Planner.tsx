import React from 'react';
import FilterBar from '../presentation/FilterBar';
import Arena from '../presentation/Arena';
import Header from '../presentation/Header';
import Milestone from './Milestone';
import { teams } from 'data/teams';
import { upcomingMilestones, recentMilestones, currentMilestone } from 'data/milestones';
import { Filter, FilterReadouts, Team, Milestone as MilestoneType } from 'data/types';
import { FILTER, OPEN_UNASSIGNED_ISSUES, OPEN_EPICS, ALL_BUG_ISSUES, SELECTED_ISSUE } from 'data/queries';
import { useQuery, useApolloClient } from '@apollo/client';
import { polling } from 'data/polling';
import { organization } from 'data/customize';
import IssueMilestones from 'components/graphql/IssueMilestones';
import IssueDetail from 'components/graphql/IssueDetail';

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

  // We may be choosing a milestone
  const [isChoosingMilestone, setChoosingMilestone] = React.useState(false);
  const milestonePicker = () => {
    if ( isChoosingMilestone ) {
      return (
        <span>
          <IssueMilestones 
            onCancel={() => { setChoosingMilestone(false); }}
            onSelectMilestone={(milestone: MilestoneType) => { 

              // Hide the picker
              setChoosingMilestone(false);

              // Update the filter
              client.writeQuery({ query: FILTER, data: { filter: { ...filter, milestone: milestone.title } } });
            }}
          />
        </span>
      );
    }
    return undefined;
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
  const epicsQuery = useQuery(OPEN_EPICS, { variables: { labels: team?.labels, groupPath: organization }});
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

  // Lookup the selected issue ID, if there is one
  const selectedIssueQuery = useQuery(SELECTED_ISSUE);
  const selectedIssueId = selectedIssueQuery.data?.selectedIssueId;

  // Create our details pane
  const details = (): React.ReactNode | undefined => {

    // Don't show for any non-issue panes
    if ( filter.username === 'diffs' || filter.username === 'links' ) {
      return undefined;
    }

    // Let's see if there's a selected issue right now
    return <IssueDetail issueId={selectedIssueId}/>
  }

  return (
    <div>
      <Header>
        <FilterBar filter={filter} 
                   readouts={filterReadouts()} 
                   onChangeFilter={handleChangeFilter}
                   onChooseMilestone={() => setChoosingMilestone(true)}/>
      </Header>
      <Arena detailPane={details()}>
        {milestones()}
        {milestonePicker()}
      </Arena>
    </div>
  );

}

export default Planner;
