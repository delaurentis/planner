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
      stats[priority.icon] = (stats[priority.icon] || 0) + (estimateInHours(issue.humanTotalTimeSpent || issue.humanTimeEstimate) || 0.0);
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

// Parse a time string like "2h 30m" into total hours
export const estimateInHours = (value: string | undefined) => {
  if (value) {
    const hourMatch = value.match(/(\d+\.?\d*)h/);
    const minuteMatch = value.match(/(\d+\.?\d*)m/);
    const dayMatch = value.match(/(\d+\.?\d*)d/);

    const hours = hourMatch ? parseFloat(hourMatch[1]) : 0;
    const minutes = minuteMatch ? parseFloat(minuteMatch[1]) / 60 : 0;
    const days = dayMatch ? parseFloat(dayMatch[1]) * 24 : 0;

    return Math.ceil(hours + minutes + days);
  }
  return 0;
}

// Parse a time string like "2h 30m" into total minutes
export const estimateInMinutes = (value: string | undefined) => {
  if (value) {
    const hourMatch = value.match(/(\d+\.?\d*)h/);
    const minuteMatch = value.match(/(\d+\.?\d*)m/);
    const dayMatch = value.match(/(\d+\.?\d*)d/);

    const hours = hourMatch ? parseFloat(hourMatch[1]) * 60 : 0;
    const minutes = minuteMatch ? parseFloat(minuteMatch[1]) : 0;
    const days = dayMatch ? parseFloat(dayMatch[1]) * 24 * 60 : 0;

    return Math.ceil(hours + minutes + days);
  }
  return 0;
}

// Get a human readable string for the estimate.  
// If >= 1 hour, show a decimal value of hours, without unnecessary trailing zeros
// If < 1 hour, show number of minutes as a whole number
export const humanTimeInSingleUnit = (value: string | undefined) => {
  if (value) {
    const minutes = estimateInMinutes(value);
    if (minutes >= 60) {
      const hours = minutes / 60;
      return `${parseFloat(hours.toFixed(2))}h`;
    } else {
      return `${Math.ceil(minutes)}m`;
    }
  }
  return '';
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
      stats[icon] = (stats[icon] || 0.0) + (estimateInHours(issue.humanTotalTimeSpent || issue.humanTimeEstimate) || 0.0);
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
