// React
import React from 'react';
import ReactDOM from 'react-dom';
import Planner from './components/graphql/Planner';
import Connection from './components/graphql/Connection';

// Static Assets
import { loadFonts } from './setup/fonts';
import { setupTimeFormatting } from './setup/time';
import './index.css';

// State Management and Offline Support
import { Filter } from './data/types';
import { vendors, requestVendorAccessToken, isStateTokenValid } from './data/vendors';
import { teams } from './data/teams';
import { currentYear, currentQuarter, currentSprint } from './data/milestones';
import { setupKeyboardFiltering } from './setup/keyboard';
import * as serviceWorker from './setup/serviceWorker';

// Fonts
loadFonts();

// Setup time formatting
setupTimeFormatting();

// Setup keyboard filtering - adds extra properties 
// to suppress shortcuts when a field is focused
setupKeyboardFiltering();

// Was there a route the user was trying to go to?
const path: string = window.location.pathname.split('/').slice(1).join('/');
const mode: string = path.split('/')[0] || 'tickets';

// If we're coming from an oauth-redirect, then let's store the user's token for future reference
const afterPound:string = window.location.hash.split('#')[1];
const hashParams:any = new URLSearchParams(afterPound);
const oauthToken:string | undefined = hashParams.get('access_token') || undefined;
if ( oauthToken ) {

  // If we're given a #access token, then we want to store it and then hide it
  // Where we store it depends on which site it came from
  if ( document.referrer?.includes('github') ) {
    window.localStorage.setItem('githubToken', oauthToken);
  }
  else {
    // Default to the gitlab token if document type isn't known
    // This fixes a bug where GitLab has stopped havin the document referrer
    // because the referrer suddenly became YouTube
    window.localStorage.setItem('gitlabToken', oauthToken);
  }
  window.history.replaceState(null, '', ' ');
}

// Initialize filter values form the URL
const queryString:string = window.location.search;
const queryParams:any = new URLSearchParams(queryString);
const username:string = queryParams.get('username') || path.split('/')[1] || 'none';
const team:string = queryParams.get('team') || window.localStorage.getItem('team') || Object.keys(teams)[0];
const year:number = parseInt(queryParams.get('year')) || currentYear;
const quarter:number = parseInt(queryParams.get('quarter')) || currentQuarter;
const sprint:number = parseInt(queryParams.get('sprint')) || currentSprint;
const milestone:string = 'All'; //`Q${quarter}S${sprint}`;
const showClosed:boolean = !(queryParams.get('closed') === 'false');
const extraColumn:string = window.localStorage.getItem('extraColumn') || 'Schedule';
const extraDiffColumn:string = window.localStorage.getItem('extraDiffColumn') || 'Overview';
const filter:Filter = { mode, year, quarter, sprint, milestone, username, team, showClosed };

// Is there an oauth code?
const oauthCode:string | undefined = queryParams.get('code');
const oauthState:string | undefined = queryParams.get('state');
if ( oauthCode ) {
  if ( document.referrer?.includes('github') ) {
    if ( oauthState && isStateTokenValid('github', oauthState) ) {
      requestVendorAccessToken('github', { code: oauthCode });
    }
  }
  else {
    if ( oauthState && isStateTokenValid('gitlab', oauthState) ) {
      requestVendorAccessToken('gitlab', { code: oauthCode });
    }
  }
}

/*// Return an optional iFrame if they want a split view
const iframe = () => {
  if ( window.location === window.parent.location ) {	
    return (
      <iframe src='https:// planner.companyname.com'
              title='Planning Panel'
              style={{ border: 'none', borderTop: '1px solid #e5e5e5', position: 'fixed', top: '50%', left: '0', width: '100vw', height: '50vh'}}/>
    );
  }
  return <div/>;
}*/
  
// Create our apollo client which manages all local and remote state
const app = (
  <div>
    <Connection vendor={vendors.gitlab} 
                filter={filter} 
                extraColumn={extraColumn}
                extraDiffColumn={extraDiffColumn}
                forceLogin={mode === 'login'}>
      <Planner/>
    </Connection>
  </div>
);

// React
ReactDOM.render(app, document.getElementById('root'));

// Offline Mode (enable in production with .register)
serviceWorker.unregister();

