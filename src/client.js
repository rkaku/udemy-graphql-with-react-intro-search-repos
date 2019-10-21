// Apollo Client
import { ApolloClient } from 'apollo-boost';
// Apollo Link
import { ApolloLink } from 'apollo-link';
// Http
import { HttpLink } from "apollo-link-http";
// Cache
import { InMemoryCache } from 'apollo-cache-inmemory';


// GitHub Token
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

// Header Link <- Authorization
const headersLink = new ApolloLink((operation, forward) => {

  // Authorization <- GitHub Token
  operation.setContext({
    headers: {
      Authorization: `Bearer ${ GITHUB_TOKEN }`
    }
  });

  return forward(operation)
});


// Endpoint
const endpoint = 'https://api.github.com/graphql';
// Http Link <- Endpoint
const httpLink = new HttpLink({ uri: endpoint });


// Apollo Link <- Header & Http Links
const link = ApolloLink.from([headersLink, httpLink]);


// Apollo Client <- Apollo Link & Cache
export default new ApolloClient({
  link,
  cache: new InMemoryCache()
});