import { Priority } from './types'

export const priorities: Priority[] = [ 
  { icon: '🛎', name: 'Triage', level: 1 },
  { icon: '🔥', name: 'P0', level: 0 },
  { icon: '⭐️', name: 'P1', level: 1 },
  { icon: '🙏', name: 'P2', level: 2 },
  { icon: '🤷🏻‍♀️', name: 'P3', level: 3 }
];

export const labelFromPriority = (priority: Priority) => `${priority.name} ${priority.icon}`;

export const priorityFromLabel = (label: string) => {
  return priorities.filter((priority: Priority) => labelFromPriority(priority) === label)[0];
}

export const priorityFromLabels = (labels: string[]) => {
  for ( const label of labels ) {
    const priority = priorityFromLabel(label);
    if ( priority ) {
      return priority;
    }
  }
  return undefined;
}

