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

  const [state, setState] = useState(QUERY_VARIABLES);

  // Search Method
  const handleChange = (event) => {
    // Bind State
    setState(
      {
        // Remaining Variables
        ...QUERY_VARIABLES,
        // Update Search Word
        query: event.target.value
      }
    );
  }

  const { after, before, first, last, query } = state;

  // App Component
  return (
    // Apollo Provider Component -> Client
    <ApolloProvider client={ client }>

      {/* Search Form */ }
      <form>
        <input value={ query } onChange={ handleChange } />
      </form>

      {/* Query Component */ }
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
            console.log({ data });
            return <div></div>
          }
        }
      </Query>
    </ApolloProvider>
  );
}


export default App;