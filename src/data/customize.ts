import { TeamLink, Team, User } from './types'

export const organization = 'companyname'

const sharedLinks: TeamLink[] = [
  { title: 'Link 1', url: 'https://google.com'},
]

export const teams: Team[] = [
  { name: 'Team 1', project: 'project1', projectId: 1, labels: [], links: sharedLinks },
  { name: 'Team 2', project: 'project2', projectId: 2, labels: [], links: sharedLinks },
]

export const users: User[] = [
  /*  { name: 'User', username: 'username', githubUsername: 'username2', teams: ['Team 1'] }, */
  { name: 'User A', username: 'user-a', teams: ['Team 1'] },
  { name: 'User B', username: 'user-b', teams: ['Team 1'] },
  { name: 'User C', username: 'user-c', teams: ['Team 1'] },
  { name: 'User D', username: 'user-d', teams: ['Team 2'] },
  { name: 'User E', username: 'user-e', teams: ['Team 2'] },
]

// These keys are used for OAuth2 authentication
// You can generate a clientId in GitLab or GitHub for your app
// The redirect URI for the app must match the URL of your server
// When doing this, you can use http://localhost:3000 for local development
// and https://planner.companyname.com for production 
export const vendorKeysByEnvironment: any = { 
  development: {
    github: {
      clientId: 'XX',
    },
    gitlab:{
      clientId: 'XX'
    }
  }, 
  production: {
    github: {
      clientId: 'XX',
    },
    gitlab: {
      clientId: 'XX'
    }
  }
};
