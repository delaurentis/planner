import type { Meta, StoryObj } from '@storybook/react';
import Chip from 'components/presentation/Chip';

export default { component: Chip } as Meta<typeof Chip>;

export const Primary: StoryObj<typeof Chip> = {
  args: {
    children: 'Text',
  },
};