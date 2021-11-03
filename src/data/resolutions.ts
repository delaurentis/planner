import { Resolution } from './types'

export const resolutions: Resolution[] = [ 
  { icon: '🛠', name: 'Code', label: 'Resolution: Code Change' },
  { icon: '✏️', name: 'DB', label: 'Resolution: DB Edit' },
  { icon: '💨', name: 'Went Away', label: 'Resolution: Placebo' },
  { icon: '☂️', name: 'Workaround', label: 'Resolution: Workaround' },
];

export const labelNameFromResolution = (resolution: Resolution) => `${resolution.icon} ${resolution.label}`;

export const resolutionFromLabelName = (label: string) => {
  return resolutions.filter((resolution: Resolution) => labelNameFromResolution(resolution) === label)[0];
}

export const resolutionsFromLabelNames = (labels: string[]) => {
  const resolutionsPerLabel = labels.map(label => resolutionFromLabelName(label));
  return resolutionsPerLabel.filter(resolution => !!resolution);
}