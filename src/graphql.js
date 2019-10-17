// Convertor
import gql from 'graphql-tag';


// Convertor -> Mutation -> GraphQL
// Add Star
export const ADD_STAR = gql`
  mutation addStar($input: AddStarInput!) {
    addStar(input: $input) {
      clientMutationId
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`
// addStar
//   clientMutationId
//   starrable
//     id
//     viewerHasStarred


// Remove Star
export const REMOVE_STAR = gql`
  mutation removeStar($input: RemoveStarInput!) {
    removeStar(input: $input) {
      clientMutationId
      starrable{
        id
        viewerHasStarred
      }
    }
  }
`
// removeStar
//   clientMutationId
//   starrable
//     id
//     viewerHasStarred


// Convertor -> Query -> GraphQL
// Search Repositories
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
// search
//   repositoryCount
//   edges
//     cursor
//     node
//       ...on Repository
//       id
//       name
//       url
//       viewerHasStarred
//       stargazers
//         totalCount
//   pageInfo
//     endCursor
//     hasNextPage
//     hasPreviousPage
//     startCursor