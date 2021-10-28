import React from 'react';
import Prompt from 'components/presentation/Prompt';
import OptionChips from 'components/presentation/OptionChips';
import { Option as OptionType,
         Issue as IssueType,
         Resolution } from 'data/types';
import { labelNameFromResolution, resolutions } from 'data/resolutions';

interface IssueResolutionProps {
  issue: IssueType;
  resolutions: Resolution[];
  isPrompt: boolean;
  onUpdate?(update: any): void;
  onClosePrompt?(): void;
}

const IssueResolution: React.FC<IssueResolutionProps> = (props) => {

  // When they switch which resolution an issue is in, we need to add / remove labels
  const handleSelectResolution = (resolution: Resolution) => {

    // We toggle each one on and off
    if ( props.resolutions.some(x => x.name === resolution.name) ) {
      props.onUpdate?.({ remove_labels: labelNameFromResolution(resolution) });
    }
    else {
      props.onUpdate?.({ add_labels: labelNameFromResolution(resolution) });
    }
  }

  // Generate a list of tabs based on upcoming milestones
  const options: OptionType[] = resolutions.map((resolution: Resolution) => {
    return { title: resolution.name,
             name: resolution.name, 
             isSelected: props.resolutions.some(x => x.name === resolution.name), 
             isSelectable: true,
             isToggleable: true,
             isExpandable: false, 
             isSmall: true,
             onSelectOption: () => { handleSelectResolution(resolution); } 
    };
  })

  // Put all of our groups together
  if ( props.isPrompt ) {
    return (
      <Prompt onClosePrompt={() => props.onClosePrompt?.()}>
        <OptionChips options={[options]}/>
      </Prompt>
    );
  }
  else {
    return <span><OptionChips options={[options]}/></span>;
  }
}

export default IssueResolution;
