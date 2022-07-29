import React from 'react';
import Login from '../pages/Login';
import { ApolloClient, NormalizedCacheObject, useQuery } from "@apollo/client";
import { IS_LOGGED_IN } from 'data/queries';
import { Vendor } from 'data/types';

interface AuthenticatedProps {
  vendor: Vendor;
  children?: React.ReactNode;
  client?: ApolloClient<NormalizedCacheObject>; // optional
}

const Authenticated: React.FC<AuthenticatedProps> = (props: AuthenticatedProps) => {

  // We test being authenticated in two ways:
  // 1. Do they have a token?
  const loggedInQuery = useQuery(IS_LOGGED_IN, { client: props.client });
  const doesTokenExist = loggedInQuery.data?.isLoggedIn;

  // 2. Is it real?  Can it access the project?
  const testQuery = useQuery(props.vendor.testQuery, { client: props.client, variables: props.vendor.testQueryVariables });
  const isTokenPossiblyValid = testQuery.loading || props.vendor.isTestOk(testQuery.data);

  // Make sure to redirect to the login page if we actually don't have a valid token
  if ( doesTokenExist && isTokenPossiblyValid ) {
    return <div>{props.children}</div>;
  }
  else {
    return <Login vendor={props.vendor}/>;
  }
}

export default Authenticated;

