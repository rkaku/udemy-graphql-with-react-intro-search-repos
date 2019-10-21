import React, { useState } from 'react';
// Apollo Provider Component
import { ApolloProvider } from 'react-apollo';
// Query Component
import { Query } from 'react-apollo';
// Client <- client.js <- Apollo Client
import client from './client';
// GraphQL
import { SEARCH_REPOSITORIES } from './graphql';


// Query Variables
const QUERY_VARIABLES = {
  after: null,
  before: null,
  first: 5,
  last: null,
  query: "GraphQL"
}


// App Component Function
const App = () => {

  // useState
  const [state, setState] = useState(QUERY_VARIABLES)

  // Search Method
  const handleChange = (event) => {
    setState(
      {
        ...QUERY_VARIABLES,
        query: event.target.value
      }
    );
  }

  // Query Variables
  const { after, before, first, last, query } = state;
  console.log({ query });

  // App Component
  return (
    // Apollo Provider Component -> Client
    <ApolloProvider client={ client }>

      {/* Search Form */ }
      <form>
        <input value={ query } onChange={ handleChange } />
      </form>

      {/* Component -> Query Handler & GraphQL */ }
      <Query
        query={ SEARCH_REPOSITORIES }
        variables={ { after, before, first, last, query } }
      >
        {
          ({ loading, error, data }) => {

            // Loading
            if (loading) return 'Loading...';

            // Error
            if (error) return `Error! ${ error }`;

            // Success
            // Data -> Search
            const search = data.search;
            // Search -> Repository Count
            const repositoryCount = search.repositoryCount;
            // Repository Unit
            const repositoryUnit =
              // Singular || Multiple
              repositoryCount === 1 ? 'Repository' : 'Repositories';
            // Result Title
            const title = `GitHub Repositories Search Results -> ${ repositoryCount } ${ repositoryUnit }`
            // Display Title
            return <h2>{ title }</h2>
          }
        }
      </Query>
    </ApolloProvider>
  );
}


export default App;