import React from 'react';

// GraphQL
import gql from 'graphql-tag';
// Apollo Provider Component
import { ApolloProvider } from 'react-apollo';
// Client <- client.js <- Apollo Client
import client from './client';
// Query Component
import { Query } from 'react-apollo';


// GraphQL
const ME = gql`
  query me {
    user(login: "iteachonudemy") {
      name
      avatarUrl
    }
  }
`


// App Component Function
function App() {

  // App Component
  return (
    // Apollo Provider -> Client
    <ApolloProvider client={ client }>
      <div>Hello, GraphQL!</div>

      {/* Query Component -> GraphQL */ }
      <Query query={ ME }>
        {
          // Error Handling
          ({ loading, error, data }) => {

            // Loading
            if (loading) return 'Loading...';

            // Error
            if (error) return `Error! ${ error }`;

            // Success -> Name
            return <div>{ data.user.name }</div>
          }
        }
      </Query>
    </ApolloProvider>
  );
}


export default App;
