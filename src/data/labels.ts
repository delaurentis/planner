import { Priority, Label, Diff } from './types';
import { priorityFromLabel } from './priorities';
import e from 'express';

export const officialLabelNames = {
  bug: '๐ Bug'
}

export const primaryLabelForEpic = (epic: any): Label => {
  return { icon: '๐งบ', name: 'Epic' }
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
  const isReviewing = labels.includes('Review ๐');
  const isPaused = labels.includes('Paused โธ');
  const isBlocked = labels.includes('Blocked ๐');
  const isDoing = labels.includes('Doing โณ');
  const isDone = issue.state === 'closed';

  // Pick an emoji based on all this info
  if ( isDone ) { 
    return { icon: 'โ', name: 'Done' };
  }
  else if ( isDoing ) { 
    return { icon: 'โณ', name: 'Doing' };
  }
  else if ( isReviewing ) { 
    return { icon: '๐', name: 'Review' }; 
  }
  else if ( isPaused ) { 
    return { icon: 'โธ', name: 'Paused' }; 
  }
  else if ( isBlocked ) { 
    return { icon: '๐', name: 'Blocked'}; 
  }
  else if ( priority ) { 
    return priority;
  }
  else { 
    return { icon: '๐คท๐ปโโ๏ธ' }; 
  }
  
}
  
export const primaryLabelForDiff = (diff: Diff): Label => {
  const isBugFix =  diff.title.toUpperCase().includes('[FIX]');
  if ( diff.isApproved ) {
    return { icon: '๐', name: 'Approved' };
  }
  else if ( diff.isDraft ) {
    return { icon: '๐', name: 'Draft' };
  }
  else {
    if ( isBugFix ) {
      return { icon: '๐', name: 'Bug' };
    }
    return { icon: '๐', name: 'Feature' };
  }
}

interface OrderingsMap {
  [index: string]: number;
}

// Create a mapping of label to relative ordering
const orderingsByDayLabel = (): OrderingsMap => {
  const weekdays = ['M','T','W','Th','F'];
  const dayLabels = weekdays.map(day => `๐ W1${day}`).concat(weekdays.map(day => `๐ W2${day}`));
  return dayLabels.reduce((orderings: OrderingsMap, label: string, index: number) => {
    orderings[label] = index + 1;
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
  const earliestOrdering = orderingsDefined.length > 0 ? Math.min(...orderingsDefined) : 20;
  
  // Closed issues get put higher up (1000 is more issues than we should ever see at once)
  const MAX_POSSIBLE_ISSUES = 1000;
  return issue.state === "closed" ? earliestOrdering - MAX_POSSIBLE_ISSUES: earliestOrdering;
}