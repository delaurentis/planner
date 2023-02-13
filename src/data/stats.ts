import { Priority, Issue } from './types'
import { priorityFromLabels } from './priorities';
import e from 'express';

// Count the # of each type of issue priority here
export const priorityStatsFromIssues = (issues: Issue[]) => {
  const orderedPriorityStats = { "🔥": 0, "⭐️": 0, "🙏": 0, "🤷🏻‍♀️": 0  };
  const statsMap = issues.reduce((stats: any, issue: any) => {
    const labelNames = issue.labels.nodes.map(node => node.title);
    const priority = priorityFromLabels(labelNames);
    if ( priority ) {
      stats[priority.icon] = (stats[priority.icon] || 0) + (estimateInHours(issue.humanTimeEstimate) || 0.0);
    }
    return stats;
  }, orderedPriorityStats);

  // Turn our map into an array and remove all the zero hour entries
  const statsArray = Object.keys(statsMap).map((icon: string) => { return { icon: icon, value: `${statsMap[icon]}h` } });
  return statsArray.filter(stat => stat.value !== '0h');
}

// Is this an hourly value?
const isEstimateInHours = (value: string | undefined) => {
  return value?.endsWith('h');
}

// Is this a minute value?
const isEstimateInMinutes = (value: string | undefined) => {
  return value?.endsWith('m');
}

// Is this a daily value?
const isEstimateInDays = (value: string | undefined) => {
  return value?.endsWith('d');
}

// Compute the total estimate in fractional floating point hours
const estimateInHours = (value: string | undefined) => {
  if ( value ) {
    if ( isEstimateInHours(value) ) {
      return Math.ceil(parseFloat(value));
    }
    else if ( isEstimateInMinutes(value) ) {
      return Math.ceil(parseFloat(value) / 60);
    }
    else if ( isEstimateInDays(value) ) {
      return Math.ceil(parseFloat(value) * 24);
    }
    return Math.ceil(parseFloat(value));
  }
  return 0;
}

// Count the # of total hours 
export const hourlyStatsFromIssues = (issues: Issue[], icons: string[]) => {
  const orderedStats = icons.reduce((stats: any, icon: string) => {
    stats[icon] = 0;
    return stats;
  }, {});

  // Add each issue to the stats map
  const statsMap = issues.reduce((stats: any, issue: any) => {
    const labelNames = issue.labels.nodes.map(node => node.title);
    icons.filter(icon => labelNames.filter(label => label.indexOf(icon) !== -1).length > 0).forEach(icon => {
      
      // We found this icon was included in the label name, so let's add it to the stats
      stats[icon] = (stats[icon] || 0.0) + (estimateInHours(issue.humanTimeEstimate) || 0.0);
    });
    return stats;
  }, orderedStats);

  // Turn our map into an array and remove all the zero hour entries
  const statsArray = Object.keys(statsMap).map((icon: string) => { return { icon: icon, value: `${Math.ceil(statsMap[icon])}h` } });
  return statsArray.filter(stat => stat.value !== `0h`);
}

// Count the # of total issues 
export const countStatsFromIssues = (issues: Issue[], icons: string[]) => {
  const orderedStats = icons.reduce((stats: any, icon: string) => {
    stats[icon] = 0;
    return stats;
  }, {});

  // Add each issue to the stats map
  const statsMap = issues.reduce((stats: any, issue: any) => {
    const labelNames = issue.labels.nodes.map(node => node.title);
    icons.filter(icon => labelNames.filter(label => label.indexOf(icon) !== -1).length > 0).forEach(icon => {
      
      // We found this icon was included in the label name, so let's add it to the stats
      stats[icon] = (stats[icon] || 0) + 1;
    });
    return stats;
  }, orderedStats);

  // Turn our map into an array and remove all the zero hour entries
  const statsArray = Object.keys(statsMap).map((icon: string) => { return { icon: icon, value: `${statsMap[icon]}` } });
  return statsArray.filter(stat => stat.value !== `0`);
}
