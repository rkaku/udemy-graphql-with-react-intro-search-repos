// Convertor
import gql from 'graphql-tag';


// Convertor -> Query -> GraphQL
export const ME = gql`
  query me {
    user(login: "iteachonudemy") {
      name
      avatarUrl
    }
  }
`

export const SEARCH_REPOSITORIES = gql`
  query searchRepositories($after: String, $before: String, $first: Int, $last: Int, $query: String!) {
    search(after: $after, before: $before, first: $first, last: $last, query: $query, type: REPOSITORY) {
      repositoryCount
      edges {
        cursor
        node {
          ... on Repository {
            id
            name
            url
            viewerHasStarred
            stargazers {
              totalCount
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`