import React, { Component } from 'react';

// Apollo Provider
import { ApolloProvider } from 'react-apollo';
// Query Handler
import { Query } from 'react-apollo';
// Query Client
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


// Component
class App extends Component {

  constructor(props) {
    super(props);
    this.state = VARIABLES;
  }

  render() {
    const { after, before, first, last, query } = this.state;

    return (
      // Component -> Apollo Provider -> Query Client
      <ApolloProvider client={ client }>

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
