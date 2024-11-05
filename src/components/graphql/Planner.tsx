import React from 'react';
import FilterBar from '../presentation/FilterBar';
import Arena from '../presentation/Arena';
import Header from '../presentation/Header';
import Milestone from './Milestone';
import { teams } from 'data/teams';
import { libraryFromMilestones } from 'data/milestones';
import { Filter, FilterReadouts, Team, Milestone as MilestoneType, MilestoneLibrary, Epic as EpicType } from 'data/types';
import { FILTER, OPEN_UNASSIGNED_ISSUES, OPEN_EPICS, ALL_BUG_ISSUES, SELECTED_ISSUE, MILESTONES } from 'data/queries';
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

  // We'll use the team to display a list, but even if it's just one, we'll use it to get the right labels
  const team: Team | undefined = filter.team ? teams[filter.team] : undefined;

  // Lookup the team name to get the members
  // const teamQuery = useQuery(GROUP_MEMBERS, { variables: { groupName: 'software-team' }});

  // Get our milestones here, and interpret start and due dates to figure out which is current, past, future
  // Pack all that info into the milestones library, to make it fast and efficient to work with in individual issues
  const milestonesQuery = useQuery(MILESTONES, { variables: { groupPath: organization }});
  const milestones: MilestoneLibrary = libraryFromMilestones(milestonesQuery.data?.group?.milestones?.nodes || []);

  // TODO: I put this up here so we could always have the unassigned count
  // but am not thrilled about it.  I'd like to move this logic elsewhere

  // If we have a milestone, we want to do another query to get # of unassigned issues
  // Figure out our variables for the query
  const unassignedQuery = useQuery(OPEN_UNASSIGNED_ISSUES, {
    pollInterval: polling.frequency.unassignedIssueCount,
    variables: { username: 'none', milestones: milestones.currentSprint, labels: team?.labels },
    skip: !milestones.currentSprint
  });

  const bugQuery = useQuery(ALL_BUG_ISSUES, {
    pollInterval: polling.frequency.bugCount,
    variables: { milestones: milestones.currentSprint, labels: [...team?.labels || [], '🐞 Bug'] },
    skip: !milestones.currentSprint
  });

  // Helper function to count the results of our unassigned and bug queries
  const countQueryResults = (query, state: string | undefined = undefined) => {
    const nodes = query.data?.group?.issues?.nodes || [];
    if ( state ) {
      return nodes.filter(node => node.state === state).length;
    }
    else {
      return nodes.length;
    }
  }

  // Added a comment

  // Compute the counts for our different categories of issues
  const filterReadouts = (): FilterReadouts => {
    return { unassignedIssueCount: countQueryResults(unassignedQuery),
             fixedBugCount: countQueryResults(bugQuery, 'closed'),
             openBugCount: countQueryResults(bugQuery, 'opened') }
  }

  // Get a list of epics (don't refresh as we go at the moment)
  const epicsQuery = useQuery(OPEN_EPICS, { variables: { labels: [], groupPath: organization }});
  const epics: EpicType[] = epicsQuery.data?.group?.epics?.nodes || [];

  // Create our milestones based on the filter - if it's All, include multiple
  const milestoneCards = (): React.ReactNode => {
    if ( filter.milestone === 'All' && (filter.mode === 'tickets' || filter.mode == 'epics') ) {
      return <div>
        {/*non-empty past sprints*/}
        {milestones.recentSprints.map((milestone: MilestoneType) => {
          return <Milestone key={`Milestone${milestone.title}`}
                            filter={{ ...filter, milestone: milestone.title }}
                            milestones={milestones}
                            epics={epics}
                            isHiddenWhenEmpty={true}/>
        })}
        {/*current sprint*/}
        <Milestone key={`Milestone${milestones.currentSprint?.title}`}
                          filter={{ ...filter, milestone: milestones.currentSprint?.title! }}
                          milestones={milestones}
                          epics={epics}
                          isHiddenWhenEmpty={false}/>
        {/*upcoming sprints*/}
        {milestones.upcomingSprints.map((milestone: MilestoneType) => {
          return <Milestone key={`Milestone${milestone.title}`}
                            filter={{ ...filter, milestone: milestone.title }}
                            milestones={milestones}
                            epics={epics}
                            isHiddenWhenEmpty={false}/>
        })}
        {/*remaining non-empty sprints*/}
        {milestones.laterSprints.map((milestone: MilestoneType) => {
          return <Milestone key={`Milestone${milestone.title}`}
                            filter={{ ...filter, milestone: milestone.title }}
                            milestones={milestones}
                            epics={epics}
                            isHiddenWhenEmpty={true}/>
        })}
        <Milestone key="MilestoneNone" filter={{ ...filter, milestone: "none" }} milestones={milestones} epics={epics}/>
        <Milestone key="MilestoneBacklog" filter={{ ...filter, milestone: "Backlog" }} milestones={milestones} epics={epics}/>
        <Milestone key="MilestoneOpportunities" filter={{ ...filter, milestone: "Opportunities" }} milestones={milestones} epics={epics}/>
        <Milestone key="MilestoneIdeas" filter={{ ...filter, milestone: "Ideas" }} milestones={milestones} epics={epics}/>
      </div>
    }
    return <Milestone filter={filter} milestones={milestones} epics={epics}/>
  }

  // Lookup the selected issue ID, if there is one
  const selectedIssueQuery = useQuery(SELECTED_ISSUE);
  const selectedIssueId = selectedIssueQuery.data?.selectedIssueId;

  // Create our details pane
  const details = (): React.ReactNode | undefined => {

    // Don't show for any non-issue panes
    if ( filter.mode === 'tickets' || filter.mode === 'epics' ) {

      // Let's see if there's a selected issue right now
      return <IssueDetail issueId={selectedIssueId}/>
    }
    else {
      return undefined
    }
  }

  return (
    <div>
      <Header>
        <FilterBar filter={filter}
                   readouts={filterReadouts()}
                   milestones={milestones}
                   epics={epics}
                   onChangeFilter={handleChangeFilter}
                   onChooseMilestone={() => setChoosingMilestone(true)}/>
      </Header>
      <Arena detailPane={details()}>
        {milestoneCards()}
        {milestonePicker()}
      </Arena>
    </div>
  );

}

export default Planner;
