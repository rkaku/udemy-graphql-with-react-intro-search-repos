// GraphQL
import gql from 'graphql-tag';


// GraphQL
export const ME = gql`
  query me {
    user(login: "iteachonudemy") {
      name
      avatarUrl
    }
  }
`
