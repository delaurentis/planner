// State Management and Offline Support
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { RestLink } from 'apollo-link-rest';
import { localTypedefs } from '../data/queries';

// Manages how we connect to the GraphQL / REST server
const linkToServer = (vendor, token) => {

  // Setup the URL we'll be connecting to
  const httpLink = new HttpLink({ uri: vendor.graphUrl });

  // Setup authorization with Apollo 
  const authLink = new ApolloLink((operation, forward) => {
    
    // Use the setContext method to set the HTTP headers.
    operation.setContext({ headers: { 'Authorization': `Bearer ${token}` } });
    
    // Call the next link in the middleware chain.
    return forward(operation);
  });

  // This lets us connect to the REST API, 
  // since there are some blank spots in the GraphQL version
 const restLink = new RestLink({ 
    uri: vendor.restUrl,
    headers: {
      'Content-Type': 'application/json'
    } 
  });

  // Use all three links together
  return authLink.concat(restLink.concat(httpLink));
}

// Our client allow us to access remote AND local state
export const apolloClient = (token, vendor, initCache) => {

  // Cache the remote and local stuff all in RAM
  const cache = new InMemoryCache();
  window[`cacheFor${vendor.name}`] = cache;

  // Setup GraphQL Client
  const link = linkToServer(vendor, token);
  const client = new ApolloClient({
    link,
    cache,
    localTypedefs
  });

  // Initiatlize the cache with the method passed in
  if ( initCache ) {
    initCache(cache);
  }

  // All done
  return client;
}
