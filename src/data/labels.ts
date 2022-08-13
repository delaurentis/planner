import { Priority, Label, Diff } from './types';
import { priorityFromLabel, priorityFromLabels } from './priorities';

export const officialLabelNames = {
  bug: '🐞 Bug',
  doing: 'Doing ⏳',
  review: 'Review 👓',
  blocked: 'Blocked 🛑', 
  paused: 'Paused ⏸'
}

export const primaryLabelForEpic = (epic: any): Label => {
  return { icon: '🧺', name: 'Epic' }
}

export const labelNamesForIssue = (issue: any): string[] => {
  return issue?.labels?.nodes?.map((labelNode: any) => labelNode.title) || [];
}

export const primaryLabelForIssue = (issue: any): Label => {

  // Map the labels now
  const labels = issue && issue.labels ? issue.labels.nodes.map((labelNode : any) => labelNode.title) : [];

  // Take the labels for this user and extract some info
  const priorityLabel = labels.filter((label: any) => !!priorityFromLabel(label))[0];
  const priority: Priority = priorityFromLabel(priorityLabel);

  // Figure out if it's done or not and combine with priority
  const isReviewing = labels.includes('Review 👓');
  const isPaused = labels.includes('Paused ⏸');
  const isBlocked = labels.includes('Blocked 🛑');
  const isDoing = labels.includes('Doing ⏳');
  const isOutOfOffice = labels.includes('OOO 🌴');
  const isDone = issue.state === 'closed';

  // Pick an emoji based on all this info
  if ( isDone ) { 
    return { icon: '✅', name: 'Done' };
  }
  else if ( isDoing ) { 
    return { icon: '⏳', name: 'Doing' };
  }
  else if ( isReviewing ) { 
    return { icon: '👓', name: 'Review' }; 
  }
  else if ( isPaused ) { 
    return { icon: '⏸', name: 'Paused' }; 
  }
  else if ( isBlocked ) { 
    return { icon: '🛑', name: 'Blocked'}; 
  }
  else if ( isOutOfOffice ) {
    return { icon: '🌴', name: 'OOO' };
  }
  else if ( priority ) { 
    return priority;
  }
  else { 
    return { icon: '🤷🏻‍♀️' }; 
  }
  
}
  
export const primaryLabelForDiff = (diff: Diff): Label => {
  const isBugFix =  diff.title.toUpperCase().includes('[FIX]');
  if ( diff.isApproved ) {
    return { icon: '👍', name: 'Approved' };
  }
  else if ( diff.isDraft ) {
    return { icon: '🖊', name: 'Draft' };
  }
  else {
    if ( isBugFix ) {
      return { icon: '🐞', name: 'Bug' };
    }
    return { icon: '👓', name: 'Feature' };
  }
}

interface OrderingsMap {
  [index: string]: number;
}

// Create a mapping of label to relative ordering
const orderingsByDayLabel = (): OrderingsMap => {
  const weekdays = ['M','T','W','Th','F'];
  const dayLabels = [...weekdays.map(day => `📅 W1${day}`), ...weekdays.map(day => `📅 W2${day}`), ...weekdays.map(day => `📅 W3${day}`)];
  return dayLabels.reduce((orderings: OrderingsMap, label: string, index: number) => {
    orderings[label] = (index + 1) * 10;
    return orderings;
  }, {});
};

// Compute the priority of the issue based on all it's labels
export const orderingForIssue = (issue: any) => {

  // Get a list of label objects
  const labelNames = issue && issue.labels ? issue.labels.nodes.map((labelNode : any) => labelNode.title) : [];

  // Map the label names to possible orderings, and then pick the minimum (first day tasks starts)
  const orderingsPossible: OrderingsMap = orderingsByDayLabel();
  const orderingsDiscovered: number[] = labelNames.map((label: string) => orderingsPossible[label]);
  const orderingsDefined: number[] = orderingsDiscovered.filter(ordering => ordering !== undefined);
  const earliestOrdering = orderingsDefined.length > 0 ? Math.min(...orderingsDefined) : 500;

  // Add an offset based on the labels applied
  const priority = priorityFromLabels(labelNames);
  const orderingWithPriority = priority ? earliestOrdering + priority.level : earliestOrdering + 4;
  
  // Closed issues get put higher up (1000 is more issues than we should ever see at once)
  const MAX_POSSIBLE_ISSUES = 1000;
  return issue.state === "closed" ? orderingWithPriority - MAX_POSSIBLE_ISSUES: orderingWithPriority;
}