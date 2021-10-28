# Running and Deploying

To run locally:

```
npm install
npm start
```

To deploy changes:

```
npm run deploy
```

<br>

# GitLab API Integration

Planner was built to use GitLab's new GraphQL API... but it has some missing functionality for mutations, so we still need to use REST calls to modify data.

All API calls require an authorization token in the HTTP header of form `Authorization: Bearer <token>`.  This token can either be retrieved using OAuth, or by getting a personal access token from GitLab.  

For local development, you can use a personal access token (instructions are provided in the app)