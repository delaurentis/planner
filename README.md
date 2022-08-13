# Overview

Planner is a front-end for GitLab that makes it significantly faster for teams to create, estimate, and manage tickets.  

It incorporates over a decade of agile software management learnings, to increase both velocity and collaboration for teams.

Merge requests can also be explored, with statistics on response time and a view that encourages faster code review turnaround times.  

<br>

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

# Keyboard Shortctus

These shortcuts apply to the issue under the mouse cursor:

- Press `a` to toggle showing the action menu
- Press `c` to complete/close an issue, and `C` to undo
- Press `d` to mark as `⏳ Doing` and `D` to undo
- Press `r` to mark as in `👓 Review` and `R` to undo
- Press `x` to delete an issue (confirmation required)
- Press `0` to set priority to `🔥 P0`
- Press `1` to set priority to `⭐️ P1`
- Press `2` to set priority to `🙏 P2`
- Press `3` to set priority to `🤷🏻‍♀️ P3`

These shortcuts apply to the sprint under the mouse cursor:

- Press `n` to type in a new issue
- Press `s` to re-sort the issues 
- Press `v` to go to the next view, and `V` to the previous

<br>

# Customizing

To customize for your organization, please edit the constants in:

- `src/data/customize.ts`

For deployment to Google Cloud, you will need to update the project ID marked `XX` in:

- `script/setup/1-gcp.sh`

And update the domain name marked `companyname` in:

- `script/setup/kube-certificate.yml`
- `script/setup/kube-ingress.yml`

<br>

# Deploying the 1st Time

This project is currently designed for deployment using Google Cloud and Kubernetes:

- Create a project in Google Cloud and write down the ID
- Make sure Kubernetes, Container API, and Compute API are enabled
- Go to terminal locally and `cd script/setup`
- Add the project ID and run `./1-gcp.sh`
- Add the domain name to the .yml files and run `./2-kube.sh`
- This script will return an IP.  You can also use `kubectl get ingress` to get the IP address anytime.
- Go to the DNS provider and link the domain name to this IP

<br>

# Setting up OAuth 

To setup OAuth:

- Go to your user Preferences in GitLab, and then select Applications.  
- Add a new Application in GitLab with a redirect URI of `https://planner.companyname.com`
- Copy the clientID and paste in `src/data/customize.ts` under `production`
- Add a second Application in GitLab with a redirect URI of `http://localhost:3000` for local development
- Copy the clientID and paste in `src/data/customize.ts` under `development` 

<br>

# GitLab API Integration

Planner was built to use GitLab's new GraphQL API... but it has some missing functionality for mutations, so we still need to use REST calls to modify data.

All API calls require an authorization token in the HTTP header of form `Authorization: Bearer <token>`.  This token can either be retrieved using OAuth, or by getting a personal access token from GitLab.   

For local development, you can create an Application in GitLab and point it to `http://localhost:3000` to test OAuth locally, or you can use a personal access token (instructions are provided in the app).

<br>

# GitHub API Integraton

Pull request viewing was supported for GitHub in a prior version of the Planner app.  This version is still available in the `github-tickets-only` branch, which will show tickets from GitLab and pull requests from GitHub.  

In the future, it would be great to add full support for GitHub in the same branch for both Issues and Pull Requests, by adding an abstraction layer that sits in front of both GitLab and GitHub APIs.

<br>

# App History

## 2020

This app was created by Pete DeLaurentis in his personal time over the course of a few weekends in 2020, and was subsequently adopted by Pete's team and several other teams at his then-employer, PicnicHealth.  

## 2021

Planner is officially published as an open source project, with his employer's blessing.  

## 2022

Pete continues to maintain the app in his spare time, including updates to make sure it continues to work with the latest version of GitLab.

