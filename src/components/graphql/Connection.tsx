import React, { useState, useEffect } from 'react';
import Authenticated from './Authenticated';
import { getVendorAccessToken, refreshVendorToken } from 'data/vendors';
import { Vendor, Filter } from 'data/types';

// State Management and Offline Support
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from 'setup/graphql';
import { IS_LOGGED_IN, FILTER, EXTRA_COLUMN, EXTRA_DIFF_COLUMN } from 'data/queries';

interface ConnectionProps {
  vendor: Vendor;
  children?: React.ReactNode;
  filter?: Filter;
  extraColumn?: string;
  extraDiffColumn?: string;
  forceLogin?: boolean;
}

const Connection: React.FC<ConnectionProps> = (props: ConnectionProps) => {

  // We want to keep track of the last token and force a refresh if it changes
  const [token, setToken] = useState(getVendorAccessToken(props.vendor.name));

  // Whenever the vendor access token refreshes, we will update our local state
  // which will cause a new token to be passed to apollo client below
  // so that GraphQL calls can continue to work
  useEffect(() => {
    refreshVendorToken(props.vendor.name, (newToken) => { setToken(newToken) });
  }, [props.vendor.name, token]);

  // Setup our cache with some initial data
  // That way we don't have to prop drill them down into the UI
  const initCache = (cache) => {
    cache.writeQuery({ query: IS_LOGGED_IN,  data: { isLoggedIn: !props.forceLogin && !!token } });
    cache.writeQuery({ query: FILTER,  data: { filter: props.filter } });
    cache.writeQuery({ query: EXTRA_COLUMN,  data: { extraColumn: props.extraColumn }});
    cache.writeQuery({ query: EXTRA_DIFF_COLUMN,  data: { extraDiffColumn: props.extraDiffColumn }});
  };

  // Create our apollo client which manages all local and remote state
  const client = apolloClient(token, props.vendor, initCache);
  return (
    <ApolloProvider client={client}>
      <Authenticated vendor={props.vendor} client={client}>
        {props.children}
      </Authenticated>
    </ApolloProvider>
  );
}

export default Connection;



