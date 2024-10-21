import { ProjectMap } from './types';
import { teams as teamsList, projects as projectsList } from './customize';

// Convert list of teams into projectName and productId name value pairs
export const projects: ProjectMap = projectsList.reduce((projects: ProjectMap, item: any) => {
  const project = item.project;
  if (project) {
    projects[project] = item.projectId;
  }
  return projects;
}, {})