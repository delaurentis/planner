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
  milestoneChoice(3, 7),
  milestoneChoice(4, 1),
  milestoneChoice(4, 2),
  milestoneChoice(4, 3),
  { metadata: { milestone: 'Backlog' }, title: 'Backlog' },
  { metadata: { isChoosingMilestone: true }, title: '⋯' },
];

// TODO: Switch this for a dynamic list
export const recentMilestones: string[] = [
  'Q3S3'
];

// TODO: Switch this for a dynamic list
export const currentMilestone: string = 'Q3S4';
export const currentYear: number = 22;
export const currentQuarter: number = 3;
export const currentSprint: number = 4;

// TODO: Switch this for a dynamic list
export const upcomingMilestones: string[] = [
  'Q3S4',
  'Q3S5',
  'Q3S6',
  'Q3S7',
];

