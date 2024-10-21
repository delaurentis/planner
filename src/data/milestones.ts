import { OptionChoice, Milestone, MilestoneLibrary } from './types';


// What day is it? (convert to ISO and strip out the time to avoid comparison issues!)
const startOfToday = (): Date => {
  return new Date(new Date().toISOString().split('T')[0]);
}

// How many past sprints with uncompleted tasks should we show
const recentIncompleteSprintsToShow = 3;

// How many future sprints should we show
const upcomingSprintsToShow = 2;

// Categorize our milestones into a quick to access library
export const libraryFromMilestones = (milestones: Milestone[]): MilestoneLibrary => {

  // Convert all milestones to apply: parseInt(milestoneFound.id.split('/').slice(-1)[0])
  const milestonesWithIds: Milestone[] = milestones.map((milestone: Milestone) => {
    return { ...milestone, id: milestone.id && milestone.id.split('/').slice(-1)[0] };
  });

  // Sort milestones in ascending order and filter out any milestones
  // without start and end dates because those aren't sprints!
  const sortedSprints = milestonesWithIds
    .filter(m => m.startDate && m.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

  // What day is it?  Avoid time-zone issues and keep a 
  // consistent experience by using start of the day
  const now = startOfToday();

  // Find out when the current sprint is based on start and due dates
  const currentSprintIndex = sortedSprints.findIndex(m =>
    new Date(m.startDate!) <= now && new Date(m.dueDate!) >= now
  );

  // Get the current sprint if our index is > -1
  const currentSprint: Milestone | undefined = currentSprintIndex >= 0 ? sortedSprints[currentSprintIndex] : undefined;

  // Our recent sprints is right now just 2 sprints back
  // We could in the future do a certain # before
  const recentSprints: Milestone[] = sortedSprints.slice(currentSprintIndex - recentIncompleteSprintsToShow, currentSprintIndex);
  const upcomingSprints: Milestone[] = sortedSprints.slice(currentSprintIndex + 1, currentSprintIndex + 1 + upcomingSprintsToShow);

  // Remaining milestones are all the milestones that haven't finished yet (or may not have started yet)
  const laterSprints: Milestone[] = sortedSprints.filter(milestone => {
    return (
        milestone.dueDate &&
        new Date(milestone.dueDate) > now &&
        !recentSprints.includes(milestone) &&
        !upcomingSprints.includes(milestone) &&
        milestone !== currentSprint
    )
  });

  // Put together our library data structure
  return {
    allMilestones: milestonesWithIds,
    recentSprints: recentSprints,
    upcomingSprints: upcomingSprints,
    laterSprints: laterSprints,
    currentSprint: currentSprint
  };
};

// Return a milestone object based on it's title only
export const milestoneFromTitle = (title: string, milestones: MilestoneLibrary): Milestone => {
  return milestones.allMilestones.find(milestone => milestone.title === title) || { title: title };
}

// Give back sprints within a certain symmetric radius (in # of sprints) of the current sprint
export const sprintsWithinRadius = (milestones: Milestone[], radius: number = 3): Milestone[] => {
  const now = startOfToday();
  const totalSprints = radius * 2 + 1; 

  const sortedMilestones = milestones
    .filter(m => m.startDate && m.dueDate) // Filter out milestones without start or due dates
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()); // Sort in descending order

  // What day is it? (convert to ISO and strip out the time to avoid comparison issues!)
  const currentSprintIndex = sortedMilestones.findIndex(m =>
    new Date(m.startDate!) <= now && new Date(m.dueDate!) >= now
  );

  if (currentSprintIndex === -1) {
    // If no current sprint, return the 7 most recent sprints
    return sortedMilestones.slice(-totalSprints);
  } else {
    // If there's a current sprint, return radius sprints before and after, plus the current sprint
    const start = Math.max(0, currentSprintIndex - radius);
    return sortedMilestones.slice(start, start + totalSprints);
  }
};

// Return a list of choices to show in the dropdown in the \
export const milestoneChoices = (milestones: MilestoneLibrary): OptionChoice[] => {
  const relevantMilestones = sprintsWithinRadius(milestones.allMilestones, 3);
  const relevantMilestoneChoices = relevantMilestones.map(milestone => ({
    metadata: {
      milestone: milestone.title,
      id: milestone.id,
      startDate: milestone.startDate,
      dueDate: milestone.dueDate
    },
    title: milestone.title
  }));

  const choices: OptionChoice[] = [
    { metadata: { milestone: 'All' }, title: 'All' },
    ...relevantMilestoneChoices,
    { metadata: { milestone: 'Backlog' }, title: 'Backlog' },
    { metadata: { milestone: 'Opportunities' }, title: 'Opportunities' },
    { metadata: { milestone: 'Ideas' }, title: 'Ideas' },
    { metadata: { isChoosingMilestone: true }, title: '⋯' },
  ];

  return choices;
};
