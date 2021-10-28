import React from 'react';
import Authenticated from './Authenticated';
import { vendors } from 'data/vendors';
import { Vendor, Filter } from 'data/types';

// State Management and Offline Support
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from 'setup/graphql';
import { IS_LOGGED_IN, FILTER, EXTRA_COLUMN } from 'data/queries';

interface ConnectionProps {
  vendor: Vendor;
  children?: React.ReactNode;
  filter?: Filter;
  extraColumn?: string;
  forceLogin?: boolean;
}

const Connection: React.FC<ConnectionProps> = (props: ConnectionProps) => {

  // Lookup the stored token
  const storedToken:string | null = window.localStorage.getItem(props.vendor.tokenName); 
  const token:string | undefined = ((storedToken?.length || 0) > 0 && storedToken) || undefined;

  // Setup our cache with some initial data
  // That way we don't have to prop drill them down into the UI
  const initCache = (cache) => {
    cache.writeQuery({ query: IS_LOGGED_IN,  data: { isLoggedIn: !props.forceLogin && !!token } });
    cache.writeQuery({ query: FILTER,  data: { filter: props.filter } });
    cache.writeQuery({ query: EXTRA_COLUMN,  data: { extraColumn: props.extraColumn }});
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



