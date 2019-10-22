import React, { useContext, useReducer } from 'react';
// useQuery
import { useQuery, useMutation } from '@apollo/react-hooks';
// Reducers
import reducer from '../reducers';
// SearchQuery Context Provider
import SearchQueryContext from '../contexts/SearchQuery';
// GraphQL
import {
  ADD_STAR,
  REMOVE_STAR,
  SEARCH_REPOSITORIES
} from '../graphql';
// Actions
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
    searchReducer: {
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

  // Go to Previous Page Button Method
  const goPrevious = (search) => {
    dispatch({
      type: GO_PREVIOUS,
      after: null,
      before: search.pageInfo.startCursor,
      first: null,
      last: PER_PAGE
    });
  };

  // Go to Next Page Button Method
  const goNext = (search) => {
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
      // search > pageInfo > endCursor, hasNextPage, hasPreviousPage, startCursor
      after: search.pageInfo.endCursor,
      before: null,
      first: PER_PAGE,
      last: null
    });
  };

  // Star Count Component Function
  const StarCount = () => {

    const { node } = useContext(SearchQueryContext);
    // search > edges > node > id, name, url, viewerHasStarred, stargazers
    // const node = props.node;
    const id = node.id;
    // viewerHasStarred
    const viewerHasStarred = node.viewerHasStarred;
    const viewerHasStarredDisplay = viewerHasStarred ? 'starred' : '-';
    // Star Total Count
    const totalCount = node.stargazers.totalCount;
    const totalCountUnit = totalCount === 1 ? 'star' : 'stars';
    const totalCountDisplay = `${ totalCount } ${ totalCountUnit }`;

    // useMutation
    const [addOrRemoveStar, { loading, error, data }] = useMutation(
      // Add or Remove Star
      viewerHasStarred ? REMOVE_STAR : ADD_STAR,
      {
        refetchQueries: mutationResult => {
          return [
            {
              query: SEARCH_REPOSITORIES,
              variables: state.searchReducer
            }
          ];
        }
      }
    );
    // const [removeStar, { loading, error, data }] = useMutation(REMOVE_STAR);

    return (
      <>
        <button
          onClick={ () => addOrRemoveStar(
            { variables: { input: { starrableId: id } } }
          ) }
        >
          { totalCountDisplay } | { viewerHasStarredDisplay }
          { loading && <p>Loading...</p> }
          { error && <p>Error! Please try again</p> }
        </button>
      </>
    );
  };

  // SearchQuery Component Function
  const SearchQuery = () => {

    // useQuery <- GraphQL, Query Variables
    const { loading, error, data, refetch, networkStatus } =
      useQuery(SEARCH_REPOSITORIES, { variables: state.searchReducer, notifyOnNetworkStatusChange: true });

    // Refetch
    if (networkStatus === 4) return 'Refetching :)'

    // Loading
    if (loading) return 'Loading...';

    // Error
    if (error) return `Error! ${ error }`;

    // Success
    // Data > search > edges > node > id, name, url, viewerHasStarred, stargazers
    const search = data.search;
    // Repository Count
    const repositoryCount = search.repositoryCount;
    // Repository Unit
    const repositoryUnit = repositoryCount === 1 ? 'Repository' : 'Repositories';
    // Result Title
    const title = `GitHub Repositories Search Results -> ${ repositoryCount } ${ repositoryUnit }`

    // SearchQuery Component
    return (
      <>
        <h2>{ title }</h2>
        <ul>
          {
            // Search Results Display
            // search > edges > node > id, name, url, viewerHasStarred, stargazers
            search.edges.map(edge => {
              const node = edge.node;
              return (
                <SearchQueryContext.Provider value={ { node } } key={ node.id }>
                  <li>
                    <a href={ node.url } target="_blank" rel="noopener noreferrer">{ node.name }</a>
                    &nbsp;
                    {/* <StarCount node={ node } /> */ }
                    <StarCount />
                  </li>
                </SearchQueryContext.Provider>
              );
            })
          }
        </ul>

        {
          // Previous Button
          // search > pageInfo > endCursor, hasNextPage, hasPreviousPage, startCursor
          search.pageInfo.hasPreviousPage === true ?
            <button
              onClick={ goPrevious.bind(this, search) }
            >
              Previous
                  </button>
            :
            null
        }

        {
          // Refetch :)
          <button onClick={ () => refetch() }>Refetch :)</button>
        }

        {
          // Next Button
          // search > pageInfo > endCursor, hasNextPage, hasPreviousPage, startCursor
          search.pageInfo.hasNextPage === true ?
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
      {/* Search Form */ }
      <form>
        <input value={ state.searchReducer.query } onChange={ handleChange } />
      </form>
      {/* Search Query Component */ }
      <SearchQuery />
    </>
  );
};


export default App;