import React from 'react';
import { Option as OptionType, 
         OptionChoice as OptionChoiceType, 
         Issue as IssueType, 
         Epic as EpicType } from 'data/types';
import AutoComplete from 'components/presentation/AutoComplete';
import Popup from 'components/presentation/Popup';
import { organization } from 'data/customize';

interface IssueEpicsProps {
  epics?: EpicType[];
  currentEpic?: EpicType;
  onCancel(): void;
  onSelectEpic?(epic: EpicType): void;
}

const IssueEpics: React.FC<IssueEpicsProps> = (props) => {

  // When they switch the epic, let's update it using an API call
  const handleSelectOption = (option: OptionType, choice: OptionChoiceType) => {
    props.onSelectEpic?.(choice.metadata.epic);
  }

  // This will show the current epic in GitLab
  const epicLink = `https://gitlab.com/groups/${organization}/-/epics/${props.currentEpic?.iid}`;

  // Subtitle varies based on if they have an epic already
  const subtitle = () => {
    if ( props.currentEpic ) {
      return <span>The current epic is <a href={epicLink} target='_blank' rel='noopener noreferrer'><b>{props.currentEpic.title}</b></a></span>;
    }
    return undefined;
  }
  
  // Sort the epics passed in
  const sortedEpics = [...(props.epics || [])].sort((a: EpicType, b: EpicType): number => {
    return a.title.length - b.title.length
  });

  // Allow them to clear the epic
  // const noneChoice = { title: 'None', metadata: { epic: { id: '/0' }} }

  // Create a set of choices out of them
  const epicChoices = sortedEpics.map((epic: EpicType) => {
    return { title: epic.title, metadata: { epic } }
  }) || [];

  // All these choices are part of one option we're modifying: epic
  const epicOption: OptionType = { title: props.currentEpic?.title || 'None',
                                    name: 'epic',
                                    choices: epicChoices,
                                    onSelectOption: handleSelectOption }

  return (
    <Popup onClosePopup={() => props.onCancel?.()}>
      <AutoComplete title={'Epic'}
                    subtitle={subtitle()}
                    text={props.currentEpic?.title}
                    placeholder={ props.currentEpic ? 'Type to change' : 'Type epic name' }
                    option={epicOption}
                    onCancel={() => props.onCancel?.()}/>
    </Popup>);
}

export default IssueEpics;
