import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CellGroups from 'components/presentation/CellGroups';

export default {
  component: CellGroups,
  argTypes: {
    onCellClick: { action: 'cell clicked' }
  }
} as Meta<typeof CellGroups>;

export const Default: StoryObj<typeof CellGroups> = {
  args: {
    tags: [['Q1S1', 'Q1S2'], ['Q1S3', 'Q1S4']]
  },
  render: (args) => {
    const RenderComponent = () => {
      const [isTagFilledState, setIsTagFilledState] = useState<Record<string, boolean>>({
        'Q1S1': false,
        'Q1S2': false,
        'Q1S3': false,
        'Q1S4': false
      });

      const icons = {
        'Q1S1': 'design',
        'Q1S2': 'build',
        'Q1S3': 'build',
        'Q1S4': 'launch'
      };

      const toggleTagFilled = (tag: string) => {
        setIsTagFilledState((prevState) => ({
          ...prevState,
          [tag]: !prevState[tag]
        }));
      };

      // Assuming CellGroup component takes a onTagClick prop.
      // This function will toggle the isTagFilled state for a specific tag.
      const handleTagClick = (tag: string) => {
        toggleTagFilled(tag);
      };
      
      return (
        <CellGroups 
          {...args} 
          isTagFilled={isTagFilledState}
          tagIcon={icons}
          onTagClick={handleTagClick}  // Assuming this prop is available in CellGroup and CellGroups components
        />
      );
    };

    return <RenderComponent />;
  }
};
