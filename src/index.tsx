// React
import React from 'react';
import ReactDOM from 'react-dom';
import Planner from './components/graphql/Planner';
import Connection from './components/graphql/Connection';

// Static Assets
import { loadFonts } from './setup/fonts';
import './index.css';

// State Management and Offline Support
import { Filter } from './data/types';
import { vendors, requestGithubAccess } from './data/vendors';
import * as serviceWorker from './setup/serviceWorker';

// Fonts
loadFonts();

// Was there a route the user was trying to go to?
const afterSlash:string = window.location.href.split('/').slice(-1)[0].split('?')[0];

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
const username:string = queryParams.get('username') || afterSlash || 'none';
const team:string = queryParams.get('team') || window.localStorage.getItem('team') || 'Team1';
const year:number = parseInt(queryParams.get('year')) || 21;
const quarter:number = parseInt(queryParams.get('quarter')) || 3;
const sprint:number = parseInt(queryParams.get('sprint')) || 6;
const milestone:string = 'All'; //`Q${quarter}S${sprint}`;
const showClosed:boolean = !(queryParams.get('closed') === 'false');
const extraColumn:string = window.localStorage.getItem('extraColumn') || 'Schedule';
const extraDiffColumn:string = window.localStorage.getItem('extraDiffColumn') || 'Overview';
const filter:Filter = { year, quarter, sprint, milestone, username, team, showClosed };

// Is there an oauth code?
const oauthCode:string | undefined = queryParams.get('code');
if ( oauthCode ) {
  requestGithubAccess(oauthCode);
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
                forceLogin={afterSlash === 'login'}>
      <Planner/>
    </Connection>
  </div>
);

// React
ReactDOM.render(app, document.getElementById('root'));

// Offline Mode (enable in production with .register)
serviceWorker.unregister();

