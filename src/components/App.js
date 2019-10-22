import React, { useReducer } from 'react';
import reducer from '../reducers';
// useQuery
import { useQuery } from '@apollo/react-hooks';
// Query Client
// import client from './client';
// GraphQL
import { SEARCH_REPOSITORIES } from '../graphql';
import {
  HANDLE_CHANGE,
  GO_NEXT,
  GO_PREVIOUS
} from '../actions'


// App Component Function
const App = () => {

  // Display Number
  const PER_PAGE = 5;
  // Query Variables
  const QUERY_VARIABLES = {
    search: {
      after: null,
      before: null,
      first: PER_PAGE,
      last: null,
      query: "GraphQL"
    }
  };

  const [state, dispatch] = useReducer(reducer, QUERY_VARIABLES);

  // useState <- Query Variables
  // const [query, setQuery] = useState(state.query);

  // Input OnChange Method
  const handleChange = (event) => {
    // setState(
    //   {
    //     ...state,
    //     query: event.target.value
    //   }
    // );
    dispatch({
      type: HANDLE_CHANGE,
      query: event.target.value
    });
  };

  // Go to Next Button Method
  const goNext = (search) => {
    // event.preventDefault();
    // setState(
    //   {
    //     ...state,
    //     // search > pageInfo > endCursor, hasNextPage, hasPreviousPage, startCursor
    //     after: search.pageInfo.endCursor,
    //     before: null,
    //     first: PER_PAGE,
    //     last: null,
    //   }
    // );
    dispatch({
      type: GO_NEXT,
      after: search.pageInfo.endCursor,
      before: null,
      first: PER_PAGE,
      last: null
    });
  };

  // SearchResults Component Function
  const SearchResults = () => {

    // useQuery <- GraphQL, Query Variables
    const { loading, error, data } = useQuery(SEARCH_REPOSITORIES, { variables: state.search });

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
            // Search Results
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
            // Next Button
            <button
              onClick={ goNext.bind(this, search) }
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
    <>
      {/* Apollo Provider Component */ }
      {/* <ApolloProvider client={ client }> */ }
      {/* Search Form */ }
      <form>
        <input value={ state.search.query } onChange={ handleChange } />
      </form>
      {/* Search Results Component */ }
      <SearchResults />
      {/* </ApolloProvider> */ }
    </>
  );
};


export default App;