import React, { Component } from 'react';

// Component for Apollo Provider, Mutation & Query
import { ApolloProvider, Mutation, Query } from 'react-apollo';
// Query Client
import client from './client';
// GraphQL
import { ADD_STAR, REMOVE_STAR, SEARCH_REPOSITORIES } from './graphql';


// Star Count Component
// search > edges > node > stargazers > totalCount
const StarCountComponent = props => {
  // node & Query Variable
  const { node, after, before, first, last, query } = props;
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

  // Star Status Component
  const StarStatusComponent = ({ addOrRemoveStar }) => {
    // Return Star Status Component
    return (
      // Star Count Component
      <button
        // On Click Method
        onClick={
          // Add Star or Remove Star
          () => addOrRemoveStar(
            {
              // Query Variable
              // search > edges > node > id
              variables: { input: { starrableId: node.id } },
              // Update
              update: (store, { data: { addStar, removeStar } }) => {
                // Is Starrable ?
                const { starrable } = addStar || removeStar;
                // Read Local Data
                const data = store.readQuery(
                  {
                    // GraphQL (Query)
                    query: SEARCH_REPOSITORIES,
                    // Query Variable
                    // search > edges > node > id
                    variables: { after, before, first, last, query }
                  }
                );

                // edges
                // search > edges > node > id
                const edges = data.search.edges;
                // Update Edges
                const newEdges = edges.map(edge => {
                  if (edge.node.id === node.id) {
                    // Star Count
                    //node > stargazers > totalCount
                    const totalCount = edge.node.stargazers.totalCount;
                    // +1 or -1
                    const diff = starrable.viewerHasStarred ? +1 : -1;
                    // New Star Count
                    const newTotalCount = totalCount + diff;
                    // Update Star Count
                    edge.node.stargazers.totalCount = newTotalCount;
                  }
                  return edge;
                })

                // Update Data
                data.search.edges = newEdges;
                // Write Local Data
                store.writeQuery(
                  {
                    query: SEARCH_REPOSITORIES,
                    data
                  }
                );
              }
            }
          )
        }
      >
        {/* Star Count Display & Is Starred ? */ }
        { totalCountDisplay } | { viewerHasStarred ? 'starred' : '-' }
      </button>
    );
  };

  // Return Star Count Component
  return (
    // Mutation Component -> GraphQL (Mutation)
    <Mutation
      // Mutation -> Add Star or Remove Star
      mutation={ viewerHasStarred ? REMOVE_STAR : ADD_STAR }

    /* Refetch Queries
          // Fetch Query
          refetchQueries={ mutationResult => {
            console.log(mutationResult);
            return [
              {
                // GraphQL (Query)
                query: SEARCH_REPOSITORIES,
                // Query Variable
                // search > edges > node > id
                variables: { after, before, first, last, query }
              }
            ];
          } }
    */

    >
      {
        // Mutation Handler
        // Star Status Component -> addStar or removeStar
        addOrRemoveStar => <StarStatusComponent addOrRemoveStar={ addOrRemoveStar } />
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
  query: ''
}


// App Component
class App extends Component {

  constructor(props) {
    super(props);
    // Initialize Variables
    this.state = QUERY_VARIABLES;

    // Bind Method
    /* this.handleChange = this.handleChange.bind(this); */

    // Ref Initialize
    this.myRef = React.createRef();
    // Bind Method
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  // Search Method
  handleSubmit(event) {
    event.preventDefault();

    // Update Query
    this.setState(
      {
        // Search Key
        // this.myRef.current -> DOM <- event.target
        query: this.myRef.current.value
      }
    );
  };

  // Search Method
  /*
    handleChange(event) {
      this.setState(
        {
          // Query Variables
          ...QUERY_VARIABLES,
          // Search Key
          query: event.target.value
        }
      );
    };
  */

  // Go to Previous Page Method
  goPrevious(search) {
    this.setState(
      {
        // Query Variables
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
        // Query Variables
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

    // Return App Component
    return (
      // Apollo Provider Component -> Query Client
      <ApolloProvider client={ client }>

        { /* Search Form */ }
        <form onSubmit={ this.handleSubmit }>
          { /* Input Form */ }
          <input ref={ this.myRef } />
          { /* Submit Button */ }
          <input type="submit" value="submit" />
        </form>

        { /* Query Component */ }
        <Query
          // GraphQL (Query)
          query={ SEARCH_REPOSITORIES }
          // Query Variables
          variables={ { after, before, first, last, query } }
        >
          {
            // Query Handler -> Load, Error, Success(Data)
            ({ loading, error, data }) => {

              // Loading -> Return -> Loading
              if (loading) return 'Loading...';

              // Error -> Return -> Error
              if (error) return `Error! ${ error }`;

              // Success ->

              // Search Data
              const search = data.search;
              // Repository Count
              const repositoryCount = search.repositoryCount;
              // Repository Count Unit
              const repositoryCountUnit = repositoryCount === 1 ? 'Repository' : 'Repositories';
              // Repository Count Display
              const repositoryCountDisplay = `GitHub Repositories Search Results -> ${ repositoryCount } ${ repositoryCountUnit }`

              // -> Return -> Success
              return (
                <>
                  { /* Repository Count Display */ }
                  <h2>{ repositoryCountDisplay }</h2>
                  <ul>
                    {
                      search.edges.map(edge => {
                        // Node
                        // search > edges > node > id, name, url, viewerHasStarred, stargazers
                        const node = edge.node;
                        return (
                          // List
                          <li key={ node.id }>
                            {/* Name & Link */ }
                            <a href={ node.url } target="_blank" rel="noopener noreferrer">{ node.name }</a>
                            &nbsp;
                            {/* Star Count Component */ }
                            <StarCountComponent node={ node } { ...{ after, before, first, last, query } } />
                          </li>
                        );
                      })
                    }
                  </ul>
                  {
                    // Go to Previous Button
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
                    // Go to Next Button
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
