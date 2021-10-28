/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProject
// ====================================================

export interface GetProject_project {
  __typename: "Project";
  /**
   * Name of the project (without namespace)
   */
  name: string;
}

export interface GetProject {
  /**
   * Find a project
   */
  project: GetProject_project | null;
}
