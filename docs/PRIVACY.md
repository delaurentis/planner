# Privacy Policy for Planner

**Last Updated:** March 12, 2025

## Introduction

Planner is an open-source project designed to help teams manage their workflow by integrating with services like Jira, GitLab, and GitHub. This privacy policy explains how Planner handles data when you use the application.

## Overview

Planner is self-hosted software that your organization deploys and maintains on your own infrastructure. By design, Planner prioritizes privacy and data security through the following principles:

1. **No Data Collection by Planner Developers**: The Planner application itself does not send any data back to the project developers or any third parties.

2. **Self-Hosted Infrastructure**: All data processed by Planner is stored and processed on your organization's own servers or cloud infrastructure.

3. **Integration-Only Access**: Planner acts as an interface to third-party services and only accesses data from those services with your explicit authorization.

## Data Handling

### What Data is Processed

Planner processes the following types of data:

- Authentication tokens for integrated services (Jira, GitLab, GitHub)
- Issue/ticket data from integrated services
- User information from integrated services (usernames, email addresses, etc.)
- Project information from integrated services

### How Data is Stored

- **Authentication Tokens**: Stored securely using httpOnly cookies or local storage (depending on the integration) on your organization's servers
- **Issue/Project Data**: Temporarily cached in memory during use but not permanently stored
- **User Preferences**: Stored locally in the browser

### Data Retention

Planner does not retain any user data beyond the current session except for authentication tokens required to maintain your connection to integrated services.

## Third-Party Services

Planner integrates with the following third-party services:

- **Jira**: When connected, Planner accesses Jira data through the Jira API using OAuth authentication
- **GitLab**: When connected, Planner accesses GitLab data through the GitLab API using OAuth authentication
- **GitHub**: When connected, Planner accesses GitHub data through the GitHub API using OAuth authentication

Each of these services has its own privacy policy, and by using Planner with these services, you are also subject to their respective policies:

- [Jira Privacy Policy](https://www.atlassian.com/legal/privacy-policy)
- [GitLab Privacy Policy](https://about.gitlab.com/privacy/)
- [GitHub Privacy Policy](https://docs.github.com/en/github/site-policy/github-privacy-statement)

## Your Responsibilities

As a self-hosted application, your organization is responsible for:

1. Securing your own infrastructure where Planner is deployed
2. Managing user access to your Planner instance
3. Configuring Planner securely according to your organization's security policies
4. Ensuring compliance with any relevant data protection regulations (GDPR, CCPA, etc.)
5. Managing OAuth credentials and application registrations with third-party services

## Data Protection Rights

Since Planner is self-hosted and doesn't collect user data on behalf of the project developers, any data protection rights would be directed to your organization as the data controller for your specific instance of Planner.

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify users of any changes by updating the "Last Updated" date at the top of this policy.

## Contact

For questions about this Privacy Policy or Planner's privacy practices, please open an issue on our GitHub repository.

---

This Privacy Policy is provided as a template and should be reviewed and adapted by each organization deploying Planner to reflect their specific implementation and legal requirements.