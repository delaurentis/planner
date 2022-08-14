import { gql } from '@apollo/client';

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

export const FILTER = gql`query Filter { filter @client }`;
export const EXTRA_COLUMN = gql`query ExtraColumn { extraColumn @client }`;
export const EXTRA_DIFF_COLUMN = gql`query ExtraDiffColumn { extraDiffColumn @client }`;
export const SELECTED_ISSUE = gql`query SelectedIssue { selectedIssueId @client }`;

// Local queries
export const localTypedefs = gql`
  extend type Filter {
    year: Integer
    quarter: Integer
    sprint: Integer
    team: String
    username: String
  }
  extend type Query {
    isLoggedIn: Boolean!
    filter: Filter!
    extraColumn: String!
    extraDiffColumn: String!
    selectedIssueId: String
  }
`;