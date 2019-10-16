// Client
import { ApolloClient } from 'apollo-client';
// Authorization
import { ApolloLink } from 'apollo-link';
// Endpoint
import { HttpLink } from "apollo-link-http";
// Cache
import { InMemoryCache } from 'apollo-cache-inmemory';


// GitHub Token
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

// Link -> Authorization
const headersLink = new ApolloLink((operation, forward) => {

  // Header -> GitHub Token
  operation.setContext({
    headers: {
      Authorization: `Bearer ${ GITHUB_TOKEN }`
    }
  });

  return forward(operation)
});


// URL
const endpoint = 'https://api.github.com/graphql';
// Link -> Endpoint
const httpLink = new HttpLink({ uri: endpoint });

// Link -> Authorization & Endpoint
const link = ApolloLink.from([headersLink, httpLink]);


// Client
export default new ApolloClient({
  link,
  cache: new InMemoryCache()
});