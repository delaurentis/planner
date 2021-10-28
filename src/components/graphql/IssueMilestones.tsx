import React from 'react';
import { Option as OptionType, 
         OptionChoice as OptionChoiceType } from 'data/types';
import AutoComplete from 'components/presentation/AutoComplete';
import Popup from 'components/presentation/Popup';
import { Milestone as MilestoneType } from 'data/types';
import { MILESTONES } from 'data/queries';
import { useQuery } from '@apollo/client';

interface IssueMilestonesProps {
  milestone?: MilestoneType;
  onCancel(): void;
  onSelectMilestone?(milestone: MilestoneType): void;
}

const IssueMilestones: React.FC<IssueMilestonesProps> = (props) => {

  const milestonesQuery = useQuery(MILESTONES);

  // When they switch the assignee, let's update it using an API call
  const handleSelectOption = (option: OptionType, choice: OptionChoiceType) => {
    props.onSelectMilestone?.(choice.metadata.milestone);
  }

  // Subtitle
  const subtitle = () => {
    if ( props.milestone ) {
      return <span>This issue is assigned to <b>{props.milestone.title}</b></span>;
    }
    return undefined;
  }
  
  // Make choice objects for users
  const milestones = milestonesQuery.data?.group?.milestones?.nodes || [];
  const activeMilestones = milestones.filter(milestone => milestone.state === 'active');
  const userChoices = activeMilestones.map((milestone: MilestoneType) => {
    return { title: milestone.title, metadata: { milestone } }
  }) || [];

  // All these choices are part of one option we're modifying: milestone
  const milestoneOption: OptionType = { title: 'Sprint',
                                       name: 'sprint',
                                       choices: userChoices,
                                       onSelectOption: handleSelectOption }

  return (
    <Popup onClosePopup={() => props.onCancel?.()}>
      <AutoComplete title={'Sprint'}
                    subtitle={subtitle()}
                    text={props.milestone?.title}
                    placeholder={ props.milestone ? 'Type to change' : 'Type assignee name' }
                    option={milestoneOption}
                    onCancel={() => props.onCancel?.()}/>
    </Popup>);
}

export default IssueMilestones;
