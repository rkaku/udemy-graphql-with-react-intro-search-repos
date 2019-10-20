// Apollo Client
import { ApolloClient } from 'apollo-client';
// Apollo Link
import { ApolloLink } from 'apollo-link';
// Http Link
import { HttpLink } from "apollo-link-http";
// Cache
import { InMemoryCache } from 'apollo-cache-inmemory';


// GitHub Token
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

// Headers Link
const headersLink = new ApolloLink((operation, forward) => {
  // Operation <- Headers
  operation.setContext({
    headers: {
      // Authorization <- GitHub Token
      Authorization: `Bearer ${ GITHUB_TOKEN }`
    }
  });
  // Forward <- Operation
  return forward(operation)
});

// URI
const endpoint = 'https://api.github.com/graphql';
// Http Link
const httpLink = new HttpLink({ uri: endpoint });

// Link <- Headers Link & Http Link
const link = ApolloLink.from([headersLink, httpLink]);


// Client <- Apollo Client <- Link, Cache
export default new ApolloClient({
  link,
  cache: new InMemoryCache()
})