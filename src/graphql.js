// Convert -> GraphQL
import gql from 'graphql-tag';


// Query -> GraphQL
export const ME = gql`
  query me {
    user(login: "iteachonudemy") {
      name
      avatarUrl
    }
  }
`
