import { Vendor, VendorMap } from './types';
import { GROUP, REPO } from 'data/queries';
import { organization, teams as teamList, vendorKeysByEnvironment } from 'data/customize';
import { generateCodeVerifier, generateCodeChallengeFromVerifier } from 'util/codeVerification';

const port = window.location.port && `:${window.location.port}`;
const baseUrl = `${window.location.protocol}//${window.location.hostname}${port}`;

// We have different API keys depending on the vendor and environment
const vendorKeys = vendorKeysByEnvironment[process.env.NODE_ENV];

export const vendors: VendorMap = {
  github: {
    name: 'github',
    title: 'GitHub',
    host: 'github.com',
    scope: 'repo',
    tokenName: 'githubToken',
    refreshTokenName: 'githubRefreshToken',
    graphUrl: `${baseUrl}/graphql`,
    restUrl: `https://api.github.com`,
    authorizeUrl: `https://github.com/login/oauth/authorize?client_id=${vendorKeys.github.clientId}&redirect_uri=${encodeURI(baseUrl)}&scope=repo`,
    personalTokenUrl: 'https://github.com/settings/tokens',
    accessTokenRequestUrl: 'https://github.com/login/oauth/access_token',
    clientId: vendorKeys.github.clientId,
    redirectUrl: baseUrl,
    instructionTitle: 'Making a diff in the 🌎.',
    instructionBody: 'Connect your GitHub account to explore all the cool code your teammates are writing.',
    instructionImage: '/github-access-token-screenshot.jpg',
    postAuthRedirectPath: '/diffs',
    redirectAfterLogin: true,
    isLoginFullscreen: false,
    testQuery: REPO,
    testQueryVariables: { repo: teamList[0]?.project }, /* use the first team's project as a connection test */
    isTestOk: (data: any) => !!(data?.organization?.repository?.name)
  },
  gitlab: {
    /* Protocol specified here: https://docs.gitlab.com/ee/api/oauth2.html */
    name: 'gitlab',
    title: 'GitLab',
    host: 'gitlab.com',
    scope: 'api',
    tokenName: 'gitlabToken',
    refreshTokenName: 'gitlabRefreshToken',
    graphUrl: `https://gitlab.com/api/graphql`,
    restUrl: `https://gitlab.com/api/v4`,
    authorizeUrl: `https://gitlab.com/oauth/authorize?client_id=${vendorKeys.gitlab.clientId}&redirect_uri=${encodeURI(baseUrl)}&response_type=code&scope=api`,
    personalTokenUrl: 'https://gitlab.com/-/profile/personal_access_tokens',
    accessTokenRequestUrl: 'https://gitlab.com/oauth/token',
    clientId: vendorKeys.gitlab.clientId,
    redirectUrl: baseUrl,
    instructionTitle: 'Let\'s start planning.',
    instructionBody: 'Get instant access with your GitLab account.',
    instructionImage: '/access-token-screenshot.jpg',
    postAuthRedirectPath: '',
    redirectAfterLogin: true,
    isLoginFullscreen: true,
    testQuery: GROUP, 
    testQueryVariables: { groupPath: organization },
    isTestOk: (data: any) => !!(data?.group?.name)
  }
}

// Generate a code verifier for the OAuth2 flow if we don't already have one
const getVendorCodeVerifier = (vendorName: string) => {
  const codeVerifierKey = `${vendorName}CodeVerifier`;
  const codeVerifier = window.localStorage.getItem(codeVerifierKey);
  if (codeVerifier) {
    return codeVerifier;
  }
  else {
    const newCodeVerifier = generateCodeVerifier();
    window.localStorage.setItem(codeVerifierKey, newCodeVerifier);
    return newCodeVerifier;
  }
}

// Redirect to the OAuth2 authorize URL for the given vendor
export const redirectToVendorAuthorization = async (vendorName: string) => {

  // Get the code verifier
  const codeVerifier = getVendorCodeVerifier(vendorName);

  // Generate a new state
  const stateToken = generateCodeVerifier();
  window.localStorage.setItem(`${vendorName}StateToken`, stateToken);

  // Generate a challenge based on the verifier (which could take a hot second)
  const codeChallenge = await generateCodeChallengeFromVerifier(codeVerifier);

  // Generate our URL with other info from the vendor
  const vendor: Vendor = vendors[vendorName];
  const url = [vendor.authorizeUrl,
               `state=${stateToken}`,
               `code_challenge_method=S256`,
               `code_challenge=${codeChallenge}`,
              ].join('&');      
  
  // Redirect to the URL
  window.location.href = url;
}

// Make sure the 1-time state token matches to prevent CSRF attacks
export const isStateTokenValid = (vendorName: string, state: string) => {
  return state === window.localStorage.getItem(`${vendorName}StateToken`)
}

// Send Github our temporary code to get an access key for the API
export const requestVendorAccessToken = async (vendorName: string, options: any) => {
  const vendor: Vendor = vendors[vendorName];
  if ( vendor ) {

    // Lookup the vendor code verifier
    const codeVerifier = window.localStorage.getItem(`${vendorName}CodeVerifier`);

    // Compute the body differently if we're refreshing a token 
    // instead of getting one the first time
    const body = (): any => {
      if ( options.refreshing ) {
        return {
          redirect_uri: vendor.redirectUrl,
          grant_type: 'refresh_token',
          client_id: vendor.clientId,
          code_verifier: codeVerifier,
          refresh_token: window.localStorage.getItem(vendor.refreshTokenName),
        }
      }
      else if ( options.code ) {
        return {
          redirect_uri: vendor.redirectUrl,
          grant_type: 'authorization_code',
          client_id: vendor.clientId,
          code_verifier: codeVerifier,
          code: options.code,
        }
      }
    }

    // Send the code and code verifier to our vendor 
    const response = await fetch(vendor.accessTokenRequestUrl,
    {
        headers: {
          'Accept': 'application/json', 
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(body())
    });

    // Store the access token and refresh token we get back
    const data = await response.json();
    if ( data ) {
      if ( data.access_token ) {
        window.localStorage.setItem(vendor.tokenName, data.access_token);
      }
      if ( data.refresh_token ) {
        window.localStorage.setItem(vendor.refreshTokenName, data.refresh_token);
      }

      // Set the expiration time (or assume it expires now if we don't get one)
      const expiresAt = Date.now() + (parseInt(data.expires_in || '0') * 1000)
      window.localStorage.setItem(`${vendorName}TokenExpiration`, `${expiresAt}`);
    }

    // Redirect back to the main page now that we've stored that
    if ( !options.refreshing ) {
      window.location.href = `${baseUrl}/${vendor.postAuthRedirectPath}`;
    }
  }
}

// Refresh the token every hour
export const refreshVendorToken = async (vendorName: string, callback: any) => {
  const vendor: Vendor = vendors[vendorName];
  if ( vendor ) {

    // Make sure there is a refresh token and se when we are supposed to refresh
    const refreshToken = window.localStorage.getItem(vendor.refreshTokenName);
    const refreshAt = parseInt(window.localStorage.getItem(`${vendorName}TokenExpiration`) || '0');

    // Catch a bug where "undefined" text can be stuck in local storage
    // preventing the app from refreshing the token successfully (it keeps trying forever)
    if ( refreshToken && refreshToken !== 'undefined' && refreshAt > 0 ) {
      
      // How long is left until the token expires
      const secondsOfTokenLifeLeft = (refreshAt - Date.now()) / 1000;

      // If the token only has 1 hr to live (half it's lifetime), refresh it
      if ( secondsOfTokenLifeLeft < 3600 /* 1 hour */ ) {
        console.log('Performing hourly rotation of OAuth access token...');
        await requestVendorAccessToken(vendorName, { refreshing: true });
        if ( callback ) {
          callback(getVendorAccessToken(vendorName));
        }
      }
      else {
        // If the token has more than 1 hour to live then
        // schedule the next refresh for when the token reaches 1 hour of life
        setTimeout(() => { refreshVendorToken(vendorName, callback) }, (secondsOfTokenLifeLeft - 3600) * 1000);
      }    
    }
  }
}

// Get the token for this vendor
export const getVendorAccessToken = (vendorName: string): string | undefined => {
  const vendor: Vendor = vendors[vendorName];
  if ( vendor ) {
    const storedToken:string | null = window.localStorage.getItem(vendor.tokenName); 
    const validTokenOrNothing: string | undefined = ((storedToken?.length || 0) > 0 && storedToken) || undefined;
    return validTokenOrNothing;
  }
  return undefined;
}