import React, { Component } from 'react';
// Apollo Provider Component
import { ApolloProvider } from 'react-apollo';
// Query Component
import { Query } from 'react-apollo';
// Client <- client.js <- Apollo Client
import client from './client';
// GraphQL
import { SEARCH_REPOSITORIES } from './graphql';


// Query Variables
const VARIABLES = {
  after: null,
  before: null,
  first: 5,
  last: null,
  query: "GraphQL"
}


// App Component Class
class App extends Component {

  constructor(props) {
    super(props);
    // Initial Query Variables
    this.state = VARIABLES;
  }

  render() {
    const { after, before, first, last, query } = this.state;

    // App Component
    return (
      // Apollo Provider -> Client
      <ApolloProvider client={ client }>

        {/* Query Component */ }
        <Query
          // GraphQL
          query={ SEARCH_REPOSITORIES }
          // Query Variables
          variables={ { after, before, first, last, query } }
        >
          {
            // Error Handling
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
  };
}


export default App;
