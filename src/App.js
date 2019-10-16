import React from 'react';

// Apollo
import { ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import client from './client';


// Query
const ME = gql`
  query me {
    user(login: "iteachonudemy") {
      name
      avatarUrl
    }
  }
`


// Component
function App() {
  return (
    <ApolloProvider client={ client }>
      <div>Hello, GraphQL!</div>

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
