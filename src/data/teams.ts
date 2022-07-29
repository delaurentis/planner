import { TeamMap, AliasMap } from './types';
import { teams as teamList, users as userList } from './customize';

export const teams: TeamMap = teamList.reduce((teams: TeamMap, team: any) => {
  const name = team.name;
  if (name) {
    const usernames = userList.filter(user => user.teams.includes(name)).map(user => user.username);
    teams[name] = { ...team, usernames };
  }
  return teams;
}, {});

export const nicknames: AliasMap = userList.reduce((nicknames: AliasMap, user: any) => {
  nicknames[user.username] = user.name;
  return nicknames;
}, {})

// A mapping of gitlab usernames to github usernames
export const usernamesForDiffLogins: AliasMap = userList.reduce((usernames: AliasMap, user: any) => {
  usernames[user.githubUsername] = user.username;
  return usernames;
}, {})

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
    if ( team.usernames?.includes(username) ) {
      return labels.concat(team.labels);
    }
    return labels;
  }, []);

  // Make the labels unique
  const uniqueLabels = [...new Set(possiblyDuplicateLabels)];
  return uniqueLabels;
}

