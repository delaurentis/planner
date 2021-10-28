import React from 'react';
import MilestoneEpics from './MilestoneEpics';
import UserIssues from './UserIssues';
import VendorDiffs from './VendorDiffs';
import Card from 'components/presentation/Card';
import Listing from 'components/presentation/Listing';
import { teams } from 'data/teams';
import { vendors } from 'data/vendors';
import { Team, TeamLink, Filter, Epic } from 'data/types';

interface UsersProps {
  filter: Filter;
  milestone?: any;
  milestones?: any[];
  epics?: Epic[];
  isHiddenWhenEmpty?: boolean;
}

// Technically this component is not using GraphQL anymore post-refactor
// But once we start pulling teams from GitLab, it will be again
// Keeping it here in the /graphql folder until it earns it's place here
const Users: React.FC<UsersProps> = (props: UsersProps) => {
  
  // We'll use the team to display a list, but even if it's just one, we'll use it to get the right labels
  const team: Team | undefined = props.filter.team ? teams[props.filter.team] : undefined;

  // Put a section full of links
  const links = (): React.ReactNode | undefined => {
    if ( team?.links?.length ) {
      return (
        <Card title='Links' titleUrl='' isLoading={false}>
          {team.links.map((link: TeamLink) => {
            return <Listing icon='🔗' title={link.title} url={link.url}/>
          })}
        </Card>
      );
    }
    return undefined;
  }

  const issuesForUsername = (username: string) => {
    return (
      <UserIssues milestone={props.milestone} 
                  showClosed={props.filter.showClosed || false} 
                  username={username}
                  epics={props.epics}
                  labels={team?.labels}
                  team={team}
                  project={team?.project}
                  isHiddenWhenEmpty={props.isHiddenWhenEmpty}/>
    );
  }

  // Are we showing a list or individual?
  if ( props.filter.username === 'team' && team ) {

    // Show the right team
    return <div>
             {issuesForUsername('none')}
             {links()}
             {team?.usernames?.map(username => issuesForUsername(username))}
           </div>;
  }
  else if ( props.filter.username === 'links' && team ) {
    return <div>{links()}</div>;
  }
  else if ( props.filter.username === 'epics' ) {
    return <MilestoneEpics milestone={props.milestone}
                           showClosed={props.filter.showClosed || false}
                           epics={props.epics}
                           labels={team?.labels}
                           team={team}/>;
  }
  else if ( props.filter.username === 'diffs' ) {
    return <VendorDiffs vendor={vendors.github} team={team}/>;
  }
  else {

    return <UserIssues milestone={props.milestone} 
                       milestones={props.milestones}
                       showClosed={props.filter.showClosed || false} 
                       username={props.filter.username || 'Team'}
                       epics={props.epics}
                       labels={team?.labels}
                       team={team}
                       project={team?.project}
                       isHiddenWhenEmpty={props.isHiddenWhenEmpty}/>;

  }
}

export default Users;
