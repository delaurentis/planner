import { gql } from '@apollo/client';

export const ORGANIZATION = gql`
  query { 
    organization(login: "companyname") { 
      name
    }
  }
`;

export const REPO = gql`
  query { 
    organization(login: "companyname") { 
      repository(name: "reponame") {
        name
      }
    }
  }
`;

export const PULL_REQUESTS = gql`
  query GetPullRequests {
    organization(login: "companyname") {
      repository(name: "reponame") {
        pullRequests(first: 100, states: OPEN, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            number
            url
            title
            isDraft
            changedFiles
            additions
            deletions
            state
            createdAt
            lastEditedAt
            assignees(first: 5) {
              nodes {
                login
              }
            }
            author {
              login
            }
            reviews(first: 100) {
              nodes {
                author {
                  login
                }
                state
                createdAt
              }
            }
          }
        }
      }
    }
  }
`;


