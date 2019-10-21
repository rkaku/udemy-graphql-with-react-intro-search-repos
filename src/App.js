import React, { useState } from 'react';
// Apollo Provider
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
// Query Client
import client from './client';
// GraphQL
import { SEARCH_REPOSITORIES } from './graphql';

// App Component Function
const App = () => {

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

  const [state, setState] = useState(QUERY_VARIABLES);
  console.log({ state })

  // Search Method
  const handleChange = (event) => {
    setState(
      {
        ...state,
        query: event.target.value
      }
    );
  };

  // Go to Next Page Method
  const goNext = (search) => {
    setState(
      {
        ...state,
        // search > pageInfo > endCursor, hasNextPage, hasPreviousPage, startCursor
        after: search.pageInfo.endCursor,
        before: null,
        first: PER_PAGE,
        last: null,
      }
    );
  };

  // SearchResults Component Function
  const SearchResults = () => {

    // useQuery
    const { loading, error, data } = useQuery(SEARCH_REPOSITORIES);

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

    // SearchResults Component
    return (
      <>
        <h2>{ title }</h2>
        <ul>
          {
            // search > edges > node > id, name, url, viewerHasStarred, stargazers
            search.edges.map(edge => {
              const node = edge.node;
              return (
                <li key={ node.id }>
                  <a href={ node.url } target="_blank" rel="noopener noreferrer">{ node.name }</a>
                </li>
              );
            })
          }
        </ul>

        {
          // search > pageInfo > endCursor, hasNextPage, hasPreviousPage, startCursor
          search.pageInfo.hasNextPage === true ?
            <button
              onClick={ goNext(search) }
            >
              Next
            </button>
            :
            null
        }
      </>
    );
  };

  // App Component
  return (
    // Apollo Provider -> Client
    <ApolloProvider client={ client }>
      {/* Search Form */ }
      <form>
        { console.log(state.query) }
        <input value={ state.query } onChange={ handleChange } />
      </form>
      <SearchResults />
    </ApolloProvider>
  );
}


export default App;