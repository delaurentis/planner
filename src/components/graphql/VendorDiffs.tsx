import React from 'react';
import Authenticated from './Authenticated';
import Diffs from './Diffs';
import { Team, Vendor, Filter } from 'data/types';

// State Management and Offline Support
import { apolloClient } from 'setup/graphql';
import { IS_LOGGED_IN, FILTER, EXTRA_COLUMN } from 'data/queries';

interface VendorDiffsProps {
  project?: string;
  team?: Team;
  vendor: Vendor;
  filter?: Filter;
  extraColumn?: string;
  forceLogin?: boolean;
}

const VendorDiffs: React.FC<VendorDiffsProps> = (props: VendorDiffsProps) => {

  // Lookup the stored token
  const storedToken:string | null = window.localStorage.getItem(props.vendor.tokenName); 
  const token:string | undefined = ((storedToken?.length || 0) > 0 && storedToken) || undefined;
  
  // Lookup the stored extra column
  const extraColumn:string = window.localStorage.getItem('extraDiffColumn') || 'Overview';

  // Setup our cache with some initial data
  // That way we don't have to prop drill them down into the UI
  const initCache = (cache) => {
    cache.writeQuery({ query: IS_LOGGED_IN,  data: { isLoggedIn: !props.forceLogin && !!token } });
    cache.writeQuery({ query: FILTER,  data: { filter: props.filter } });
    cache.writeQuery({ query: EXTRA_COLUMN,  data: { extraColumn } });
  };

  // Create our apollo client which manages all local and remote state
  const client = apolloClient(token, props.vendor, initCache);
  return (
    <Authenticated vendor={props.vendor} client={client}>
      <Diffs team={props.team} client={client}/>
    </Authenticated>
  );
}

export default VendorDiffs;



