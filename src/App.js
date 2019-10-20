import React from 'react';

// Apollo Provider Component
import { ApolloProvider } from 'react-apollo';
// Query Component
import { Query } from 'react-apollo';
// Client <- client.js <- Apollo Client
import client from './client';

// GraphQL
import { ME } from './graphql';


// App Component Function
function App() {

  // App Component
  return (
    // Apollo Provider Component -> Client
    <ApolloProvider client={ client }>
      <div>Hello, GraphQL!</div>

      {/* Query Component */ }
      <Query query={ ME }>
        {
          // Error Handling
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
