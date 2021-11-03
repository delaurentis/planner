/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUsers
// ====================================================

export interface GetUsers_users_nodes {
  __typename: "User";
  /**
   * ID of the user
   */
  id: string;
  /**
   * Username of the user. Unique within this instance of GitLab
   */
  username: string;
  /**
   * Human-readable name of the user
   */
  name: string;
}

export interface GetUsers_users {
  __typename: "UserConnection";
  /**
   * A list of nodes.
   */
  nodes: (GetUsers_users_nodes | null)[] | null;
}

export interface GetUsers {
  /**
   * Find users
   */
  users: GetUsers_users | null;
}
