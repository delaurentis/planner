/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { IssueState } from "./globalTypes";

// ====================================================
// GraphQL fragment: issueResults
// ====================================================

export interface issueResults_labels_nodes {
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

export interface issueResults_labels {
  __typename: "LabelConnection";
  /**
   * A list of nodes.
   */
  nodes: (issueResults_labels_nodes | null)[] | null;
}

export interface issueResults {
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
  labels: issueResults_labels | null;
  /**
   * Timestamp of when the issue was created
   */
  createdAt: Date;
  /**
   * Timestamp of when the issue was last updated
   */
  updatedAt: Date;
}
