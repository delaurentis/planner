import React from 'react';
import { StoryObj, Meta } from '@storybook/react';
import JobListing, { JobListingProps } from 'components/presentation/JobListing';
import styles from './JobListing.module.css';

export default {
  component: JobListing,
} as Meta;

const Template: StoryObj<JobListingProps> = {
  render: args => <JobListing {...args} />,
  args: {

  }
}

export const Default: StoryObj<JobListingProps> = {
  ...Template,
  args: {
    title: 'Job 1',
    icon: '🔧',
    owner: 'Pete'
  }
};

export const Selected: StoryObj<JobListingProps> = {
  ...Template,
  args: {
    title: 'Job 2',
    icon: '🛠',
    owner: 'Anne-Sophie',
    isSelected: true
  }
};

export const AnotherJob: StoryObj<JobListingProps> = {
  ...Template,
  args: {
    title: 'Job 3',
    icon: '🔩',
    owner: 'Sofia'
  }
};
