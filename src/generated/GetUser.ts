/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUser
// ====================================================

export interface GetUser_user {
  __typename: "User";
  /**
   * Username of the user. Unique within this instance of GitLab
   */
  username: string;
  /**
   * Human-readable name of the user
   */
  name: string;
  /**
   * ID of the user
   */
  id: string;
}

export interface GetUser {
  /**
   * Find a user
   */
  user: GetUser_user | null;
}

export interface GetUserVariables {
  username: string;
}
