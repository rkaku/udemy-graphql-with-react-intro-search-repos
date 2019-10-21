import React, { Component } from 'react';

// Apollo Provider and Mutation & Query Handler
import { ApolloProvider, Mutation, Query } from 'react-apollo';
// Query Client
import client from './client';
// GraphQL
import { ADD_STAR, SEARCH_REPOSITORIES } from './graphql';


// Star Count Component Function
// search > edges > node > stargazers > totalCount
const StarCountButtonComponent = props => {
  // node
  const node = props.node;
  // Is Starred ?
  // node > viewerHasStarred
  const viewerHasStarred = node.viewerHasStarred;
  // Star Count
  //node > stargazers > totalCount
  const totalCount = node.stargazers.totalCount;
  // Star Count Unit
  const totalCountUnit = totalCount === 1 ? 'star' : 'stars'
  // Star Count Display
  const totalCountDisplay = `${ totalCount } ${ totalCountUnit }`;
  // Star Status Component Function -> addStar ->
  const StarStatus = ({ addStar }) => {
    // StarStatusComponent
    return (
      // Star Count Button -> Display & Is Starred ?
      <button
        // Add Star
        onClick={
          () => addStar(
            {
              // search > edges > node > id
              variables: { input: { starrableId: node.id } }
            }
          )
        }
      >{ totalCountDisplay } | { viewerHasStarred ? 'starred' : '-' }</button>
    );
  };

  // Star Count Component
  return (
    // Component -> GraphQL (Mutation)
    <Mutation mutation={ ADD_STAR }>
      {
        // Star Status Component -> addStar
        addStar => <StarStatus addStar={ addStar } />
      }
    </Mutation>
  );
};


// Display Number
const PER_PAGE = 5;
// Query Variables
const QUERY_VARIABLES = {
  after: null,
  before: null,
  first: PER_PAGE,
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
  };

  // Search Method
  handleChange(event) {
    this.setState(
      {
        ...QUERY_VARIABLES,
        query: event.target.value
      }
    );
  };

  // Go to Previous Page Method
  goPrevious(search) {
    this.setState(
      {
        // search > pageInfo > endCursor, hasNextPage, hasPreviousPage, startCursor
        after: null,
        before: search.pageInfo.startCursor,
        first: null,
        last: PER_PAGE
      }
    );
  };

  // Go to Next Page Method
  goNext(search) {
    this.setState(
      {
        // search > pageInfo > endCursor, hasNextPage, hasPreviousPage, startCursor
        after: search.pageInfo.endCursor,
        before: null,
        first: PER_PAGE,
        last: null
      }
    );
  };

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

        {/* Component -> Query Handler & GraphQL (Query) */ }
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
              // Repository Count Unit
              const repositoryCountUnit = repositoryCount === 1 ? 'Repository' : 'Repositories';
              // Repository Count Display
              const repositoryCountDisplay = `GitHub Repositories Search Results -> ${ repositoryCount } ${ repositoryCountUnit }`
              return (
                <>
                  <h2>{ repositoryCountDisplay }</h2>
                  <ul>
                    {
                      search.edges.map(edge => {
                        // search > edges > node > id, name, url, viewerHasStarred, stargazers
                        const node = edge.node;
                        return (
                          <li key={ node.id }>
                            <a href={ node.url } target="_blank" rel="noopener noreferrer">{ node.name }</a>
                            &nbsp;
                            <StarCountButtonComponent node={ node } />
                          </li>
                        );
                      })
                    }
                  </ul>
                  {
                    // search > pageInfo > endCursor, hasNextPage, hasPreviousPage, startCursor
                    search.pageInfo.hasPreviousPage === true ?
                      <button
                        // Bind Method
                        onClick={ this.goPrevious.bind(this, search) }
                      >
                        Previous
                      </button>
                      :
                      null
                  }
                  {
                    // search > pageInfo > endCursor, hasNextPage, hasPreviousPage, startCursor
                    search.pageInfo.hasNextPage === true ?
                      <button
                        // Bind Method
                        onClick={ this.goNext.bind(this, search) }
                      >
                        Next
                      </button>
                      :
                      null
                  }
                </>
              );
            }
          }
        </Query>
      </ApolloProvider>
    );
  };
}


export default App;
