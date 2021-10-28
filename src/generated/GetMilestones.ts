/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMilestones
// ====================================================

export interface GetMilestones_group_milestones_nodes {
  __typename: "Milestone";
  /**
   * ID of the milestone
   */
  id: string;
  /**
   * Title of the milestone
   */
  title: string;
}

export interface GetMilestones_group_milestones {
  __typename: "MilestoneConnection";
  /**
   * A list of nodes.
   */
  nodes: (GetMilestones_group_milestones_nodes | null)[] | null;
}

export interface GetMilestones_group {
  __typename: "Group";
  /**
   * Name of the namespace
   */
  name: string;
  /**
   * Milestones of the group
   */
  milestones: GetMilestones_group_milestones | null;
}

export interface GetMilestones {
  /**
   * Find a group
   */
  group: GetMilestones_group | null;
}
