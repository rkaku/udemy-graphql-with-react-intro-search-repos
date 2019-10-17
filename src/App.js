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
const QUERY_VARIABLES = {
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
    // Initialize Variables
    this.state = QUERY_VARIABLES;
    // Bind Method
    this.handleChange = this.handleChange.bind(this);
  }

  // Search Method
  handleChange(event) {
    this.setState(
      {
        ...QUERY_VARIABLES,
        query: event.target.value
      }
    );
  }

  render() {
    // Query Variables
    const { after, before, first, last, query } = this.state;
    console.log({ query });

    return (
      // Component -> Apollo Provider -> Query Client
      <ApolloProvider client={ client }>

        {/* Search Form */ }
        <form>
          <input value={ query } onChange={ this.handleChange } />
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
              // Search Data
              const search = data.search;
              // Repository Count
              const repositoryCount = search.repositoryCount;
              // Repository Unit
              const repositoryUnit = repositoryCount === 1 ? 'Repository' : 'Repositories';
              // Result Title
              const title = `GitHub Repositories Search Results -> ${ repositoryCount } ${ repositoryUnit }`
              return <h2>{ title }</h2>
            }
          }
        </Query>
      </ApolloProvider>
    );
  };
}


export default App;
