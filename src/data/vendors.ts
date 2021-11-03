import { VendorMap } from './types';
import { PROJECT, REPO } from 'data/queries';

const port = window.location.port && `:${window.location.port}`;
const baseUrl = `${window.location.protocol}//${window.location.hostname}${port}`;

// We have different API keys depending on the vendor and environment
const vendorKeysByEnvironment: any = { 
  development: {
    github: {
      clientId: 'XX',
      clientSecret: 'XXX',
    },
    gitlab:{
      clientId: 'XX'
    }
  }, 
  production: {
    github: {
      clientId: 'XX',
      clientSecret: 'XXX'
    },
    gitlab: {
      clientId: 'XX'
    }
  }
};
const vendorKeys = vendorKeysByEnvironment[process.env.NODE_ENV];

export const vendors: VendorMap = {
  github: {
    name: 'GitHub',
    host: 'github.com',
    scope: 'repo',
    tokenName: 'githubToken',
    graphUrl: `${baseUrl}/graphql`,
    restUrl: `https://api.github.com`,
    authorizeUrl: `https://github.com/login/oauth/authorize?client_id=${vendorKeys.github.clientId}&client_secret=${vendorKeys.github.clientSecret}&redirect_uri=${encodeURI(baseUrl)}&scope=repo`,
    personalTokenUrl: 'https://github.com/settings/tokens',
    clientId: vendorKeys.github.clientId,
    clientSecret: vendorKeys.github.clientSecret,
    redirectUrl: baseUrl,
    instructionTitle: 'Making a diff in the 🌎.',
    instructionBody: 'Connect your GitHub account to explore all the cool code your teammates are writing.',
    instructionImage: '/github-access-token-screenshot.jpg',
    redirectAfterLogin: true,
    isLoginFullscreen: false,
    testQuery: REPO,
    isTestOk: (data: any) => !!(data?.organization?.repository?.name)
  },
  gitlab: {
    name: 'GitLab',
    host: 'gitlab.companyname.com',
    scope: 'api',
    tokenName: 'gitlabToken',
    graphUrl: `https://gitlab.companyname.com/api/graphql`,
    restUrl: `https://gitlab.companyname.com/api/v4/`,
    authorizeUrl: `https://gitlab.companyname.com/oauth/authorize?client_id=${vendorKeys.gitlab.clientId}&redirect_uri=${encodeURI(baseUrl)}&response_type=token&scope=api`,
    personalTokenUrl: 'https://gitlab.companyname.com/profile/personal_access_tokens',
    clientId: vendorKeys.gitlab.clientId,
    redirectUrl: baseUrl,
    instructionTitle: 'Let\'s start planning.',
    instructionBody: 'Get instant access with your GitLab account.',
    instructionImage: '/access-token-screenshot.jpg',
    redirectAfterLogin: true,
    isLoginFullscreen: true,
    testQuery: PROJECT,
    isTestOk: (data: any) => !!(data?.project?.name)
  }
}

// Send Github our temporary code to get an access key for the API
export const requestGithubAccess = async (code: string) => {
  const response = await fetch(`${baseUrl}/login/oauth/access_token`,
  {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        client_id: vendors.github.clientId,
        client_secret: vendors.github.clientSecret,
        code,
        redirect_uri: vendors.github.redirectUrl
      })
  });

  // Store the token we get back
  const data = await response.json();
  window.localStorage.setItem(vendors.github.tokenName, data.access_token);

  // Redirect back to the main page now that we've stored that
  window.location.href = `${baseUrl}/diffs`;
}