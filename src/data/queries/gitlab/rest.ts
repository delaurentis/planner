import { gql } from '@apollo/client';

export const UPDATE_ISSUE = gql`
    mutation UpdateIssue($projectId: ID!, $id: ID!, $input: Any!) {
      updateIssue(projectId: $projectId, id: $id, input: $input) 
        @rest(type: "Issue", path: "/projects/{args.projectId}/issues/{args.id}", method: "PUT") {
        id,
        title,
        state,
        labels
      }
    }
`;

export const DELETE_ISSUE = gql`
    mutation DeleteIssue($projectId: ID!, $id: ID!) {
      deleteIssue(projectId: $projectId, id: $id) 
        @rest(type: "Issue", path: "/projects/{args.projectId}/issues/{args.id}", method: "DELETE") {
        NoResponse
      }
    }
`;

export const CREATE_ISSUE = gql`
    mutation CreateIssue($projectId: ID!, $input: Any!) {
      createIssue(projectId: $projectId, input: $input) 
        @rest(type: "Issue", path: "/projects/{args.projectId}/issues", method: "POST") {
        NoResponse
      }
    }
`;

export const ESTIMATE_ISSUE = gql`
    mutation EstimateIssue($projectId: ID!, $id: ID!, $estimate: Int!, $input: Any!) {
      estimateIssue(projectId: $projectId, id: $id, input: $input)
        @rest(type: "Issue", path: "/projects/{args.projectId}/issues/{args.id}/time_estimate", method: "POST") {
          NoResponse
      }
    }
`;

export const MOVE_ISSUE = gql`
    mutation MoveIssue($projectId: ID!, $id: ID!, $input: Any!) {
      moveIssue(projectId: $projectId, id: $id, input: $input)
        @rest(type: "Issue", path: "/projects/{args.projectId}/issues/{args.id}/move", method: "POST") {
          NoResponse
      }
    }
`;

export const CREATE_NOTE = gql`
  mutation CreateNote($projectId: ID!, $issueId: ID!, $input: Any!) {
    createNote(projectId: $projectId, issueId: $issueId, input: $input)
      @rest(type: "Note", path: "/projects/{args.projectId}/issues/{args.issueId}/notes", method: "POST") {
        NoResponse
    }
  }
`;

export const SUBGROUPS = gql`
  query GetSubgroups($groupId: ID!) {
    subgroups(groupId: $groupId) 
      @rest(type: "Issue", path: "/groups/{args.groupId}/subgroups", method: "GET") {
        id,
        name
    }
  }
`;

export const CREATE_GROUP_LABEL = gql`
  mutation CreateGroupLabel($groupId: ID!, $input: Any!) {
    createGroupLabel(groupId: $groupId, input: $input) 
      @rest(type: "Label", path: "/groups/{args.groupId}/labels", method: "POST") {
      NoResponse
    }
  }
`;

// Fetch existing labels query
export const FETCH_EXISTING_LABELS = gql`
  query FetchExistingLabels($groupId: ID!) {
    groupLabels(groupId: $groupId) 
      @rest(type: "Label", path: "/groups/{args.groupId}/labels?per_page=1000") {
      name
    }
  }
`;
