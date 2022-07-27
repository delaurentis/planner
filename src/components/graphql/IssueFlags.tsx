import React from 'react';
import OptionChips from 'components/presentation/OptionChips';
import { Option as OptionType,
         Issue as IssueType,
         Flag } from 'data/types';
import { labelNameFromFlag, flags } from 'data/flags';

interface IssueFlagsProps {
  issue: IssueType;
  flags: Flag[];
  categories: string[];
  isIconOnly: boolean;
  onUpdate?(update: any): void;
}

const IssueFlags: React.FC<IssueFlagsProps> = (props) => {

  // When they switch which flag an issue is in, we need to add / remove labels
  const handleSelectFlag = (flag: Flag) => {

    // We toggle each one on and off
    if ( props.flags.some(x => x.name === flag.name) ) {
      props.onUpdate?.({ remove_labels: labelNameFromFlag(flag) });
    }
    else {
      props.onUpdate?.({ add_labels: labelNameFromFlag(flag) });
    }
  }

  // Generate a list of tabs based on upcoming milestones
  const filteredFlags = flags.filter(x => props.categories.includes(x.category));
  const options: OptionType[] = filteredFlags.map((flag: Flag) => {
    return { title: props.isIconOnly ? flag.icon : `${flag.icon} ${flag.name}`,
             name: flag.name, 
             isSelected: props.flags.some(x => x.name === flag.name), 
             isSelectable: true,
             isToggleable: true,
             isExpandable: false,
             isDimmable: props.isIconOnly,
             isIconOnly: props.isIconOnly, 
             isMultiSelectable: true,
             isSmall: true,
             onSelectOption: () => { handleSelectFlag(flag); } 
    };
  })

  return <span><OptionChips options={[options]}/></span>;
}

export default IssueFlags;
