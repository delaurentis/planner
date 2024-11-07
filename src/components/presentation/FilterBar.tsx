import React, { useState } from 'react';
import OptionChips from './OptionChips';
import { teams, titleForUsername } from 'data/teams';
import { Team, Filter, FilterReadouts, Option, OptionChoice, MilestoneLibrary, Epic } from 'data/types';
import { milestoneChoices } from 'data/milestones';
import { capitalizeFirstLetter } from 'util/capitalize'
import IssueEpics from 'components/graphql/IssueEpics';
import Chip from './Chip';

interface FilterBarProps {
  filter: Filter;
  readouts: FilterReadouts;
  milestones: MilestoneLibrary;
  epics: Epic[];
  onChangeFilter?(changedFilter: Filter): void;
  onChooseMilestone?(): void;
}

const FilterBar:React.FC<FilterBarProps> = (props: FilterBarProps) => {
  
  // When the epic gets clicked, show our autocomplete
  const [isEditingEpic, setEditingEpic] = useState<boolean>(false);

  const filter: Filter = props.filter;
  const onSelectUser = (option: Option) => { 
    props.onChangeFilter?.({ ...filter, username: option.name, mode: 'tickets' }) 
    if ( option.name !== 'none' ) {
      window.history.pushState(null, '', `/tickets/${option.name}`);
    }
    else {
      window.history.pushState(null, '', `/tickets`);
    }
  };

  const onSelectMode = (option: Option) => {
    props.onChangeFilter?.({ ...filter, mode: option.name, username: option.name === 'tickets' ? 'none' : '' }) 
    window.history.pushState(null, '', `/${option.name}`);
  }
 
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
    else if ( filter?.username === 'epics' ) {
      props.onChangeFilter?.({ ...filter, team: newTeam, username: 'epics' });
    }
    else {
      // Reset username to 'none' when switching teams (unless in diffs/fixes mode)
      props.onChangeFilter?.({ ...filter, team: newTeam, username: 'none' });
    }

    // Store it so when we refresh page we keep the same team
    window.localStorage.setItem('team', choice?.metadata);
  }

  // Only show epic picker if we're editing
  const epicPicker = () => {
    if (isEditingEpic) {
      return (
        <span>
          <IssueEpics 
            epics={props.epics}
            currentEpic={props.epics?.find(e => e.title === filter.epicName)}
            onSelectEpic={(epic) => {
              props.onChangeFilter?.({ ...filter, epicName: epic?.title || undefined });
              if ( epic?.title ) {
                window.localStorage.setItem('epic', epic.title);
                //window.history.pushState(null, '', `/epics/${epic?.title}`);
              }
              setEditingEpic(false);
            }}
            onCancel={() => setEditingEpic(false)}
          />
        </span>
      );
    }
    return undefined;
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
      choices: milestoneChoices(props.milestones),
      onSelectOption: onSelectWhen },
    
    { title: filter.team, 
      name: 'team', 
      isSelected: true, 
      isSelectable: true,
      isExpandable: true, 
      choices: teamChoices, 
      onSelectOption: onSelectTeam }

  ];

  // Make an option for each mode
  const optionForMode = (mode: string): Option => {
    return { 
      name: mode, 
      isRadio: true,
      isSelected: mode === filter?.mode,
      onSelectOption: onSelectMode
    };
  }

  // Make option out of user
  const optionForUser = (username: string): Option => {
    return { 
      name: username, 
      title: titleForUsername(username), 
      isRadio: true,
      isSelected: filter?.mode === 'tickets' && username === filter?.username,
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
  //const teamOption = optionForUser('team');
  //const epicsOption = {...optionForUser('epics'), title: 'Epics'};

  const roadmapOption: Option = {...optionForMode('roadmap'), icon: 'roadmap'};
  const epicsOption: Option = {...optionForMode('epics'), icon: 'epics'};
  const ticketsOption: Option = {...optionForMode('tickets'), icon: 'tickets'};
  const linksOption: Option = {...optionForMode('links'), icon: 'link'};
  const diffsOption: Option = {...optionForMode('diffs'), icon: 'code'};
  const modeOptions: Option[] = [roadmapOption, epicsOption, ticketsOption, diffsOption, linksOption];

  const epicOption: Option = {
    title: filter.epicName || 'Choose Epic...',
    name: 'epic',
    isSelected: !!filter.epicName,
    isBlank: false,
    onSelectOption: (option) => setEditingEpic(true)
  };

  const noneOption: Option = {...optionForUser('none'), title: titleForUnassignedIssues()};
  const userOptions: Option[] = team?.usernames?.map((username: string) => optionForUser(username)) || [];
  const variableOptions = props.filter.mode == 'epics' ? [epicOption] : [noneOption].concat(userOptions);

  // Put all of our groups together
  return (
    <div>
      <OptionChips options={[mainOptions, modeOptions, variableOptions]}/>

      {filter.mode === 'epics' && (
        <span>
          {epicPicker()}
        </span>
      )}
    </div>
  );

}

export default FilterBar;
