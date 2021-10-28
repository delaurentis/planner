import { Environment } from './types'

export const environments: Environment[] = [ 
  { icon: '🏅', name: 'Prod', label: 'Production' },
  { icon: '🐤', name: 'Canary', label: 'Canary' },
  { icon: '🛠', name: 'Branch', label: 'Feature Branch' }
];

export const labelNameFromEnvironment = (environment: Environment): string => `${environment.icon} ${environment.label}`;

export const environmentFromLabelName = (label: string) => {
  return environments.filter((environment: Environment) => labelNameFromEnvironment(environment) === label)[0];
}

export const environmentFromLabelNames = (labels: string[]) => {
  const environmentsPerLabel = labels.map(label => environmentFromLabelName(label));
  return environmentsPerLabel.filter(environment => !!environment)[0];
}