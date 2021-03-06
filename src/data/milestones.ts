import { OptionChoice } from './types';

const milestoneChoice = (quarter: number, sprint: number) => {
  return { metadata: { milestone: `Q${quarter}S${sprint}`, quarter, sprint }, title: `Q${quarter}S${sprint}` };
}

// TODO: Auto-compute these based on where we are in sprint calendar + automatic radius
export const milestoneChoices = (): OptionChoice[] => [
  { metadata: { milestone: 'All' }, title: 'All' },
  milestoneChoice(3, 1),
  milestoneChoice(3, 2),
  milestoneChoice(3, 3),
  milestoneChoice(3, 4),
  milestoneChoice(3, 5),
  milestoneChoice(3, 6),
  milestoneChoice(4, 1),
  milestoneChoice(4, 2),
  milestoneChoice(4, 3),
  milestoneChoice(4, 4),
  milestoneChoice(4, 5),
  milestoneChoice(4, 6),
    { metadata: { milestone: 'Backlog' }, title: 'Backlog' }
];

// TODO: Switch this for a dynamic list
export const recentMilestones: string[] = [
  'Q3S2'
];

// TODO: Switch this for a dynamic list
export const currentMilestone: string = 'Q3S3';
export const currentYear: number = 22;
export const currentQuarter: number = 3;
export const currentSprint: number = 4;

// TODO: Switch this for a dynamic list
export const upcomingMilestones: string[] = [
  'Q3S3',
  'Q3S4',
  'Q3S5',
];

