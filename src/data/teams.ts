import { TeamMap, AliasMap } from './types';

export const teams: TeamMap = {
  'All Teams': { 
    name: 'All Teams', 
    labels: [],
    project: 'reponame',
    links: [],
    hideUserTabs: true,
    usernames: ['user1', 'user2', 'user3']
  },
  'Team 1': { 
    name: 'Team 1', 
    labels: ['Team 1 Labelname'],
    project: 'reponame',
    usernames: ['user1', 'user2'],
    links: [{ title: 'My Link', url: 'https://google.com'}]
  }
};

export const nicknames: AliasMap = {
  user1: 'Thing 1'
}

// A mapping of gitlab usernames to github usernames
export const usernamesForDiffLogins: AliasMap = {
  'github-username': 'gitlab-username'
}

// Return the title to show in the tab for the given username
export const titleForUsername = (username: string): string => {

  if ( username === 'none' ) {
    return 'Requests'
  }
  else if ( username === 'fixes' ) {
    return 'Fixes'
  }
  else if ( username === 'epics' ) {
    return 'Epics'
  }
  else if ( username === 'diffs' ) {
    return 'Diffs'
  }
  else {
    const name = nicknames[username] || username;
    return name && (name.charAt(0)?.toUpperCase() + name.slice(1));
  }
}

// Give us back a set of labels which we should apply when adding issues for this user
// We basically get labels from all the teams that they are a part of
export const labelsForUsername = (username: string) => {

  // Get all the labels, there may be some duplicates
  const teamNames = Object.keys(teams);
  const possiblyDuplicateLabels: string[] = teamNames.reduce((labels: any, teamName: string) => {
    const team = teams[teamName];
    if ( team.usernames.includes(username) ) {
      return labels.concat(team.labels);
    }
    return labels;
  }, []);

  // Make the labels unique
  const uniqueLabels = [...new Set(possiblyDuplicateLabels)];
  return uniqueLabels;
}

