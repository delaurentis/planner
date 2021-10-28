import React from 'react';
import { Option as OptionType, 
         OptionChoice as OptionChoiceType, 
         Team } from 'data/types';
import AutoComplete from 'components/presentation/AutoComplete';
import Popup from 'components/presentation/Popup';
import { titleForUsername } from 'data/teams';

interface IssueAssigneesProps {
  team?: Team;
  username?: string;
  onCancel(): void;
  onSelectAssignee?(username: string): void;
}

const IssueAssignees: React.FC<IssueAssigneesProps> = (props) => {

  // Makes our username look nice – we use this a few times below
  const userTitle = props.username && titleForUsername(props.username);

  // When they switch the assignee, let's update it using an API call
  const handleSelectOption = (option: OptionType, choice: OptionChoiceType) => {
    props.onSelectAssignee?.(choice.metadata.username);
  }

  // Subtitle
  const subtitle = () => {
    if ( props.username ) {
      return <span>This issue is assigned to <b>{userTitle}</b></span>;
    }
    return undefined;
  }
  
  // Have an option to unassign
  const noneChoice = { title: 'None', metadata: { username: 'none' } }

  // Make choice objects for users
  const userChoices = props.team?.usernames.map((username: string) => {
    return { title: titleForUsername(username), metadata: { username } }
  }) || [];

  // All these choices are part of one option we're modifying: username
  const assigneeOption: OptionType = { title: 'Assignee',
                                       name: 'assignee',
                                       choices: [noneChoice, ...userChoices],
                                       onSelectOption: handleSelectOption }

  return (
    <Popup onClosePopup={() => props.onCancel?.()}>
      <AutoComplete title={'Assignee'}
                    subtitle={subtitle()}
                    text={userTitle}
                    placeholder={ props.username ? 'Type to change' : 'Type assignee name' }
                    option={assigneeOption}
                    onCancel={() => props.onCancel?.()}/>
    </Popup>);
}

export default IssueAssignees;
