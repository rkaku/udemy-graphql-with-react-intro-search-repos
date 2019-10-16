import React from 'react';

// Component -> Apollo Provider
import { ApolloProvider } from 'react-apollo';
// Query Handler
import { Query } from 'react-apollo';
// Client
import client from './client';

// GraphQL
import { ME } from './graphql';


// Component
function App() {
  return (
    // Component -> Apollo Provider
    <ApolloProvider client={ client }>
      <div>Hello, GraphQL!</div>

      {/* Query Handler */ }
      <Query query={ ME }>
        {
          ({ loading, error, data }) => {

            // Loading
            if (loading) return 'Loading...';

            // Error
            if (error) return `Error! ${ error }`;

            // Success
            return <div>{ data.user.name }</div>
          }
        }
      </Query>
    </ApolloProvider>
  );
}


export default App;
