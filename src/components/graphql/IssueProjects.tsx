import React from 'react';
import { Option as OptionType, 
         OptionChoice as OptionChoiceType, 
         Team } from 'data/types';
import AutoComplete from 'components/presentation/AutoComplete';
import Popup from 'components/presentation/Popup';
import { capitalizeFirstLetter } from 'util/capitalize';
import { projects } from 'data/projects';

interface IssueProjectsProps {
  team?: Team;
  project?: string;
  onCancel(): void;
  onSelectProject?(project: string): void;
}

const IssueProjects: React.FC<IssueProjectsProps> = (props) => {

  // Makes our project title look nice – we use this a few times below
  const projectTitle = props.project && capitalizeFirstLetter(props.project);

  // When they switch the assignee, let's update it using an API call
  const handleSelectOption = (option: OptionType, choice: OptionChoiceType) => {
    props.onSelectProject?.(choice.metadata.project);
  }

  // Subtitle
  const subtitle = () => {
    if ( props.project ) {
      return <span>This issue is in the project <b>{projectTitle}</b></span>;
    }
    return undefined;
  }
  
  // Make choice objects for projects
  const projectChoices = Object.keys(projects).map((project: string) => {
    return { title: capitalizeFirstLetter(project), metadata: { project } }
  }) || [];

  // All these choices are part of one option we're modifying: project
  const projectOption: OptionType = { title: 'Project',
                                       name: 'project',
                                       choices: projectChoices,
                                       onSelectOption: handleSelectOption }

  return (
    <Popup onClosePopup={() => props.onCancel?.()}>
      <AutoComplete title={'Project'}
                    subtitle={subtitle()}
                    text={projectTitle}
                    placeholder={ props.project ? 'Type to change' : 'Type project name' }
                    option={projectOption}
                    onCancel={() => props.onCancel?.()}/>
    </Popup>);
}

export default IssueProjects;
