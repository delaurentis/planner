/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { IssueState } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetClosedUserIssues
// ====================================================

export interface GetClosedUserIssues_project_issues_nodes_labels_nodes {
  __typename: "Label";
  /**
   * Label ID
   */
  id: string;
  /**
   * Content of the label
   */
  title: string;
}

export interface GetClosedUserIssues_project_issues_nodes_labels {
  __typename: "LabelConnection";
  /**
   * A list of nodes.
   */
  nodes: (GetClosedUserIssues_project_issues_nodes_labels_nodes | null)[] | null;
}

export interface GetClosedUserIssues_project_issues_nodes {
  __typename: "Issue";
  /**
   * Internal ID of the issue
   */
  iid: string;
  /**
   * Title of the issue
   */
  title: string;
  /**
   * State of the issue
   */
  state: IssueState;
  /**
   * Web URL of the issue
   */
  webUrl: string;
  /**
   * Due date of the issue
   */
  dueDate: Date | null;
  /**
   * Labels of the issue
   */
  labels: GetClosedUserIssues_project_issues_nodes_labels | null;
  /**
   * Timestamp of when the issue was created
   */
  createdAt: Date;
  /**
   * Timestamp of when the issue was last updated
   */
  updatedAt: Date;
}

export interface GetClosedUserIssues_project_issues {
  __typename: "IssueConnection";
  /**
   * A list of nodes.
   */
  nodes: (GetClosedUserIssues_project_issues_nodes | null)[] | null;
}

export interface GetClosedUserIssues_project {
  __typename: "Project";
  /**
   * Name of the project (without namespace)
   */
  name: string;
  /**
   * Issues of the project
   */
  issues: GetClosedUserIssues_project_issues | null;
}

export interface GetClosedUserIssues {
  /**
   * Find a project
   */
  project: GetClosedUserIssues_project | null;
}

export interface GetClosedUserIssuesVariables {
  username: string;
  milestones?: (string | null)[] | null;
}
