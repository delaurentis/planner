import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Cell from 'components/presentation/Cell'; // Adjust this import path accordingly

export default {
  component: Cell,
  decorators: [
    (Story) => (
      <div style={{ width: '50px', height: '50px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    onTagClick: { action: 'cell-clicked' }, // Action logger in Storybook's UI
  },
} as Meta<typeof Cell>;

export const Default: StoryObj<typeof Cell> = {
  args: {
    tag: "Q1S1",
    isFilled: false,
    onTagClick: (tag) => { console.log("Clicked:", tag) }
  },
};

export const FilledWithoutIcon: StoryObj<typeof Cell> = {
  args: {
    tag: "Q1S1",
    isFilled: true,
    onTagClick: (tag) => { console.log("Clicked:", tag) }
  },
};

export const FilledWithIconDesign: StoryObj<typeof Cell> = {
  args: {
    tag: "Q1S1",
    isFilled: true,
    icon: 'design',
    onTagClick: (tag) => { console.log("Clicked:", tag) }
  },
};

export const FilledWithIconBuild: StoryObj<typeof Cell> = {
  args: {
    tag: "Q1S1",
    isFilled: true,
    icon: 'build',
    onTagClick: (tag) => { console.log("Clicked:", tag) }
  },
};

export const FilledWithIconLaunch: StoryObj<typeof Cell> = {
  args: {
    tag: "Q1S1",
    isFilled: true,
    icon: 'launch',
    onTagClick: (tag) => { console.log("Clicked:", tag) }
  },
};

export const MultipleCells: StoryObj<typeof Cell> = {
  render: (args) => {
    const cells = [
      { tag: "Q1S1", isFilled: true, icon: 'design', onTagClick: (tag) => { console.log("Clicked:", tag) } },
      { tag: "Q1S2", isFilled: true, icon: 'design', onTagClick: (tag) => { console.log("Clicked:", tag) } },
      { tag: "Q1S3", isFilled: true, icon: 'build', onTagClick: (tag) => { console.log("Clicked:", tag) } },
      { tag: "Q1S4", isFilled: true, icon: 'build', onTagClick: (tag) => { console.log("Clicked:", tag) } },
      { tag: "Q1S5", isFilled: true, icon: 'build', onTagClick: (tag) => { console.log("Clicked:", tag) } },
      { tag: "Q1S6", isFilled: true, icon: 'launch', onTagClick: (tag) => { console.log("Clicked:", tag) } },
      { tag: "separator", isSeparator: true },
      { tag: "Q2S1", isFilled: true, icon: 'build', onTagClick: (tag) => { console.log("Clicked:", tag) } },
      { tag: "Q2S2", isFilled: true, icon: 'build', onTagClick: (tag) => { console.log("Clicked:", tag) } },
      { tag: "Q2S3", isFilled: true, icon: 'launch', onTagClick: (tag) => { console.log("Clicked:", tag) } },
    ];

    const CellVariants = () => (
      <div style={{ display: 'flex', flexDirection: 'row', gap: 0 }}>
        {cells.map((cell) => (
          <Cell {...args} {...cell} key={cell.tag} />
        ))}
      </div>
    );

    return <CellVariants />;
  },
  args: {
    onTagClick: (tag) => { console.log("Clicked:", tag) }
  }
};

// And so on for other icons if needed...
