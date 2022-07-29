import { ProjectMap } from './types';
import { teams as teamsList } from './customize';

// Convert list of teams into projectName and productId name value pairs
export const projects: ProjectMap = teamsList.reduce((projects: ProjectMap, team: any) => {
  const project = team.project;
  if (project) {
    projects[project] = team.projectId;
  }
  return projects;
}, {})
