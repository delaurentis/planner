import React from 'react';
import OptionChips from './OptionChips';
import { teams, titleForUsername } from 'data/teams';
import { Team, Filter, FilterReadouts, Option, OptionChoice } from 'data/types';
import { milestoneChoices } from 'data/milestones';
import { capitalizeFirstLetter } from 'util/capitalize'

interface FilterBarProps {
  filter: Filter;
  readouts: FilterReadouts;
  onChangeFilter?(changedFilter: Filter): void;
  onChooseMilestone?(): void;
}

const FilterBar:React.FC<FilterBarProps> = (props: FilterBarProps) => {
  
  const filter: Filter = props.filter;
  const onSelectUser = (option: Option) => { 
    props.onChangeFilter?.({ ...filter, username: option.name }) 
    window.history.pushState(null, '', `/${option.name}`);
  };
 
  const onSelectWhen = (option: Option, choice?: OptionChoice | undefined) => {
    if ( choice?.metadata.isChoosingMilestone ) {
      props.onChooseMilestone?.();
    }
    else {
      props.onChangeFilter?.({ ...filter, 
        quarter: choice?.metadata.quarter,
        sprint: choice?.metadata.sprint,
        milestone: choice?.metadata.milestone });
    }
  }
  
  const onSelectTeam = (option: Option, choice?: OptionChoice | undefined) => {

    // Keep the user on Diff's if they are switching teams
    const newTeam = choice?.metadata;
    if ( filter?.username === 'diffs' ) {
      props.onChangeFilter?.({ ...filter, team: newTeam, username: 'diffs' });
    }
    else if ( filter?.username === 'fixes' ) {
      props.onChangeFilter?.({ ...filter, team: newTeam, username: 'fixes' });
    }
    else {
      // If the username isn't none, then make sure it's none (and not a member from another team)
      const optionalUsername = { username: 'none' };
      props.onChangeFilter?.({ ...filter, team: newTeam, ...optionalUsername });
    }

    // Store it so when we refresh page we keep the same team
    window.localStorage.setItem('team', choice?.metadata);
  }

  const teamChoices: OptionChoice[] = Object.keys(teams).map(team => { 
    return { metadata: team, 
             title: `${teams[team].parentTeam ? '• ' : ''}${capitalizeFirstLetter(team)}`,
            }
  });
  
  // When and team tabs
  const mainOptions: Option[] = [
    { title: filter.milestone,
      name: 'when', 
      isSelected: true, 
      isSelectable: true,
      isExpandable: true, 
      choices: milestoneChoices(),
      onSelectOption: onSelectWhen },
    
    { title: filter.team, 
      name: 'team', 
      isSelected: true, 
      isSelectable: true,
      isExpandable: true, 
      choices: teamChoices, 
      onSelectOption: onSelectTeam }
  ];

  // Make option out of user
  const optionForUser = (username: string): Option => {
    return { 
      name: username, 
      title: titleForUsername(username), 
      isSelected: username === filter?.username,
      onSelectOption: onSelectUser 
    };
  }

  // User tabs
  const team: Team = teams[filter.team];
 
  const titleForUnassignedIssues = (): string => {
    if ( props.readouts.unassignedIssueCount ) {
      if ( props.readouts.unassignedIssueCount === 1 ) {
        return `1 Request`;
      }
      else {
        return `${props.readouts.unassignedIssueCount} Requests`;
      }
    }
    return 'Requests';
  }

  const titleForFixedIssues = (): string => {
    
    const fixed = props.readouts.fixedBugCount ? [`${props.readouts.fixedBugCount} Fixes`] : []
    const open = props.readouts.openBugCount ? [`${props.readouts.openBugCount} Bugs`] : []
    const all = fixed.concat(open);
    if ( all.length > 0 ) {
      return all.join(', ');
    }
    else {
      return 'Fixes'
    }
  }

  // Come up with a title for the # of diffs
  const titleForDiffs = (): string => {
    return 'Diffs';
  }

  // TODO: Refactor so "epics" is not an artificial username
  // (This is a very hacky way to get Epics functionality.
  // The justification for being hacky is we want a quick prototype
  // so we can validate teh UX of this feature)
  const teamOption = optionForUser('team');
  const linksOption = {...optionForUser('links'), title: 'Links'};
  const epicsOption = {...optionForUser('epics'), title: 'Epics'};
  const noneOption = {...optionForUser('none'), title: titleForUnassignedIssues()};
  const fixesOptions = {...optionForUser('fixes'), title: titleForFixedIssues()};
  const diffsOption = {...optionForUser('diffs'), title: titleForDiffs()};
  const userOptions = team?.usernames?.map((username: string) => optionForUser(username)) || [];
  const variableOptions = team?.hideUserTabs ? [noneOption, diffsOption, linksOption] : [noneOption, diffsOption, linksOption].concat(userOptions);

  // Put all of our groups together
  return <OptionChips options={[mainOptions, variableOptions]}/>

}

export default FilterBar;
