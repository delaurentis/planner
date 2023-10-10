import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Actuator from 'components/presentation/Actuator';

export default {
  component: Actuator,
  argTypes: {
    onActuate: { action: 'actuated' },  // Log the action in Storybook’s Actions panel when the button is clicked
  },
} as Meta;

export const Default: StoryObj<typeof Actuator> = {
  args: {
    title: 'Sample Title',
    description: 'This is a sample description for the actuator component.',
    buttonText: 'Click Me',
  },
};

export const WithLongTitle: StoryObj<typeof Actuator> = {
  args: {
    title: 'This Is A Sample Title With A Longer Length',
    description: 'This actuator component has a longer title for demonstration purposes.',
    buttonText: 'Actuate',
  },
};

export const Multiple: StoryObj<typeof Actuator> = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <Actuator {...args} />
      <Actuator {...args} />
      <Actuator {...args} />
    </div>
  ),
  args: {
    title: 'Name of Action',
    description: 'In real life the text of each one of these would be different.',
    buttonText: 'Actuate',
  },
};


// Add more story objects as per the different states you want to visualize
