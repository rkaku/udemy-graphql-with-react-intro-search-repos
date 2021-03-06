import React, { useContext, useReducer, useRef } from 'react';
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
  HANDLE_SUBMIT,
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
      query: ""
    }
  };

  // useReducer <- Reducers & Query Variables
  const [state, dispatch] = useReducer(reducer, QUERY_VARIABLES);

  // Submit Method
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({
      type: HANDLE_SUBMIT,
      query: input.current.value
    });
  };

  // Input OnChange Method
  // const handleChange = (event) => {
  //   dispatch({
  //     type: HANDLE_CHANGE,
  //     query: event.target.value
  //   });
  // };

  // Go to Previous Page Button Method
  const goPrevious = (search) => {
    dispatch({
      type: GO_PREVIOUS,
      after: null,
      // search > pageInfo > endCursor, hasNextPage, hasPreviousPage, startCursor
      before: search.pageInfo.startCursor,
      first: null,
      last: PER_PAGE
    });
  };

  // Go to Next Page Button Method
  const goNext = (search) => {
    dispatch({
      type: GO_NEXT,
      // search > pageInfo > endCursor, hasNextPage, hasPreviousPage, startCursor
      after: search.pageInfo.endCursor,
      before: null,
      first: PER_PAGE,
      last: null
    });
  };

  // Star Mutation Component Function
  const StarMutation = () => {

    // <- useContext <- SearchQuery Context <- node
    const { node } = useContext(SearchQueryContext);
    // search > edges > node > id, name, url, viewerHasStarred, stargazers
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
        update(cache, { data: { addStar, removeStar } }) {

          // Starrable Response
          const { starrable } = addStar || removeStar;
          // Read Cache Memory
          const data = cache.readQuery({ query: SEARCH_REPOSITORIES, variables: state.searchReducer });
          // search > edges > node > id, name, url, viewerHasStarred, stargazers
          const edges = data.search.edges;
          // Update Edge -> Star Count
          const newEdges = edges.map(edge => {
            if (edge.node.id === node.id) {
              // Star Count
              const totalCount = edge.node.stargazers.totalCount;
              // Star Count Increment or Decrement
              const diff = starrable.viewerHasStarred ? 1 : -1;
              // New Star Count
              const newTotalCount = totalCount + diff;
              // Update Star Count
              edge.node.stargazers.totalCount = newTotalCount;
            }
            return edge;
          })
          // Update Edges
          data.search.edges = newEdges;
          // Write Cache Memory
          cache.writeQuery({ query: SEARCH_REPOSITORIES, data });
        }
        // refetchQueries: mutationResult => {
        //   return [
        //     {
        //       query: SEARCH_REPOSITORIES,
        //       variables: state.searchReducer
        //     }
        //   ];
        // }
      }
    );

    // Star Mutation Component
    return (
      <>
        {/* Add or Remove Star Button */ }
        <button
          // Click -> Mutation
          onClick={ () => addOrRemoveStar(
            { variables: { input: { starrableId: id } } }
          ) }
        >
          {/* Star Count & Status Display */ }
          { totalCountDisplay } | { viewerHasStarredDisplay }
          { loading && <p>Loading...</p> }
          { error && <p>Error! Please try again</p> }
        </button>
      </>
    );
  };

  // Search Query Component Function
  const SearchQuery = () => {

    // useQuery <- GraphQL, Query Variables
    const { loading, error, data, refetch, networkStatus } =
      useQuery(SEARCH_REPOSITORIES, { variables: state.searchReducer, notifyOnNetworkStatusChange: true });

    // Refetch
    if (networkStatus === 4) return 'Refetching :)'

    // Loading
    if (loading) return 'Loading...';

    // Error
    if (error) return `Error :( ${ error }`;

    // Success
    // Data > search > edges > node > id, name, url, viewerHasStarred, stargazers
    const search = data.search;
    // Repository Count
    const repositoryCount = search.repositoryCount;
    // Repository Unit
    const repositoryUnit = repositoryCount === 1 ? 'Repository' : 'Repositories';
    // Repository Count Display
    const title = `GitHub Repositories Search Results -> ${ repositoryCount } ${ repositoryUnit }`

    // Search Query Component
    return (
      <>
        <h2>{ title }</h2>
        <ul>
          {
            // Search Results Display
            // search > edges > node > id, name, url, viewerHasStarred, stargazers
            search.edges.map(edge => {
              const node = edge.node;
              // Map -> Search Result Display
              return (
                // SearchQuery Context Provider <- node
                <SearchQueryContext.Provider value={ { node } } key={ node.id }>
                  {/* Name & Link */ }
                  <li>
                    <a href={ node.url } target="_blank" rel="noopener noreferrer">{ node.name }</a>
                    &nbsp;
                    {/* Star Mutation Component */ }
                    <StarMutation />
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

  // input <- Ref
  const input = useRef(null);

  // App Component
  return (
    <>
      {/* Search Form */ }
      <form onSubmit={ handleSubmit }>
        <input ref={ input } />
        <input type="submit" value="Submit" />
        {/* <input value={ state.searchReducer.query } onChange={ handleChange } /> */ }
      </form>
      {/* Search Query Component */ }
      <SearchQuery />
    </>
  );
};


export default App;