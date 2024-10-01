import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CellGroup from 'components/presentation/CellGroup'; // Ensure the correct path

export default {
  component: CellGroup,
  decorators: [
    (Story) => (
      <div style={{ margin: '1rem' }}>
        <Story />
      </div>
    ),
  ],
} as Meta<typeof CellGroup>;

const statusForTagExample:any = {
  'Q1S1': 'design',
  'Q1S2': 'build',
  'Q1S3': 'launch',
  'Q1S4': 'filled',
  'Q1S5': 'empty',
};

export const Default: StoryObj<typeof CellGroup> = {
  args: {
    tags: ['Q1S1', 'Q1S2', 'Q1S3', 'Q1S4', 'Q1S5'],
    isTagFilled: { Q1S1: true, Q1S2: true, Q1S3: true, Q1S4: true, Q1S5: true },
    tagIcon: statusForTagExample,
  },
};

export const FilledCells: StoryObj<typeof CellGroup> = {
  args: {
    tags: ['Q1S1', 'Q1S2', 'Q1S3'],
    isTagFilled: { Q1S1: true, Q1S2: true, Q1S3: true },
    tagIcon: {
      Q1S1: 'filled',
      Q1S2: 'filled',
      Q1S3: 'filled',
    },
  },
};

export const DesignAndBuild: StoryObj<typeof CellGroup> = {
  args: {
    tags: ['Q1S1', 'Q1S2', 'Q1S3'],
    isTagFilled: { Q1S1: true, Q1S2: true, Q1S3: true },
    tagIcon: {
      Q1S1: 'design',
      Q1S2: 'build',
      Q1S3: 'empty',
    },
  },
};
