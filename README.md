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

# GitLab API Integration

Planner was built to use GitLab's new GraphQL API... but it has some missing functionality for mutations, so we still need to use REST calls to modify data.

All API calls require an authorization token in the HTTP header of form `Authorization: Bearer <token>`.  This token can either be retrieved using OAuth, or by getting a personal access token from GitLab.  

For local development, you can use a personal access token (instructions are provided in the app)

Note: GitLab has deprecated the OAuth API method this project used previously.  Currently, automated login is not working, and personal access tokens are required for all users.

# App History

## 2020

This app was created by Pete DeLaurentis in his personal time over the course of a few weekends in 2020, and was subsequently adopted by Pete's team and several other teams at his then-employer, PicnicHealth.  

## 2021

Planner is officially published as an open source project, with his employer's blessing.  

## 2022

Pete continues to maintain the app in his spare time.

