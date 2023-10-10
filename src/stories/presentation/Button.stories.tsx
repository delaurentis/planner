import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from 'components/presentation/Button'; // Ensure the correct path

export default {
  component: Button,
  decorators: [
    (Story) => (
      <div style={{ width: '200px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    onClick: { action: 'clicked' }, // Action logger in Storybook's UI
  },
} as Meta<typeof Button>;

export const Primary: StoryObj<typeof Button> = {
  args: {
    title: 'Primary Button',
    size: 'medium',
  },
};

export const Secondary: StoryObj<typeof Button> = {
  args: {
    title: 'Secondary Button',
    size: 'medium',
    isSecondary: true,
  },
};

export const Large: StoryObj<typeof Button> = {
  args: {
    title: 'Large Button',
    size: 'large',
  },
};

export const Medium: StoryObj<typeof Button> = {
  args: {
    title: 'Medium Button',
    size: 'medium',
  },
};

export const Small: StoryObj<typeof Button> = {
  args: {
    title: 'Small Button',
    size: 'small',
  },
};

export const Disabled: StoryObj<typeof Button> = {
  args: {
    title: 'Disabled Button',
    isDisabled: true,
  },
};
