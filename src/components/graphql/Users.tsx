import React from 'react';
import UserIssues from './UserIssues';
import VendorDiffs from './VendorDiffs';
import LabelCreationActuator from './LabelCreationActuator';
import Diffs from './Diffs';
import Card from 'components/presentation/Card';
import Listing from 'components/presentation/Listing';
import { teams } from 'data/teams';
import { organization, roadmapUrl } from 'data/customize';
import { vendors } from 'data/vendors';
import { Team, TeamLink, Filter, Epic, MilestoneLibrary } from 'data/types';

interface UsersProps {
  filter: Filter;
  milestone?: any;
  milestones: MilestoneLibrary;
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
                  milestones={props.milestones}
                  showClosed={props.filter.showClosed || false} 
                  username={username}
                  epics={props.epics}
                  epicName={props.filter.mode === 'epics' ? props.filter.epicName : undefined}
                  labels={team?.labels}
                  team={team}
                  project={team?.project}
                  isHiddenWhenEmpty={props.isHiddenWhenEmpty}/>
    );
  }

  if ( props.filter.mode === 'links' && team ) {
    return <div>{links()}</div>;
  }
  else if ( props.filter.mode === 'roadmap' && team ) {
    return <div><iframe style={{ marginTop: '-24px', width: '98vw', height: '90vh' }} src={roadmapUrl}></iframe></div>
  }
  else if ( props.filter.mode === 'advanced' && team ) {
    return <Card title="Advanced" titleUrl="" isLoading={false}><LabelCreationActuator groupId={organization}/></Card>;
  }

  else if ( props.filter.mode === 'diffs' ) {
    return <Diffs team={team} project={team?.project}/>;
  }
  else {

    // If we're on issues or epics modes, this will show issues below
    return <UserIssues milestone={props.milestone} 
                       milestones={props.milestones}
                       showClosed={props.filter.showClosed || false} 
                       username={props.filter.mode === 'epics' ? 'all' : props.filter.username || 'none'}
                       epicName={props.filter.mode === 'epics' ? props.filter.epicName : undefined}
                       epics={props.epics}
                       labels={team?.labels}
                       team={team}
                       project={team?.project}
                       isHiddenWhenEmpty={props.isHiddenWhenEmpty}/>;

  }
}

export default Users;
