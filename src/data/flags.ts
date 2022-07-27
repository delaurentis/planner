import { Flag } from './types'

export const flags: Flag[] = [ 
  { icon: '🐞', category: 'Surprises', name: 'Bug', label: 'Bug' },
  { icon: '👻', category: 'Surprises', name: 'Surprise', label: 'Surprise' },
  { icon: '📝', category: 'Details', name: 'Needed', label: 'Details Needed' },
  { icon: '🕵🏻', category: 'Details', name: 'Approved', label: 'Details Approved' },
];

export const labelNameFromFlag = (flag: Flag) => `${flag.icon} ${flag.label}`;

export const flagFromLabelName = (label: string) => {
  return flags.filter((flag: Flag) => labelNameFromFlag(flag) === label)[0];
}

export const flagsFromLabelNames = (labels: string[]) => {
  const flagsPerLabel = labels.map(label => flagFromLabelName(label));
  return flagsPerLabel.filter(flag => !!flag);
}