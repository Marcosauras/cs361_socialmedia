import { gql } from "@apollo/client";
// Any updates in here should be added to the server/src/schemas/typeDefs.js file as well

//  This query retrieves the currently logged-in user's profile
export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      profileImg
      posts {
        _id
        content
        images
        createdAt
        author {
          _id
          username
        }
      }
    }
  }
`;
// This query retrieves a single user by their ID
export const QUERY_USER = gql`
  query singleUser($_id: ID!) {
    user(_id: $_id) {
      _id
      username
      profileImg
      posts {
        _id
        content
        images
        createdAt
        author {
          _id
          username
        }
      }
    }
  }
`;
// This query retrieves all users and their posts
export const GET_POSTS = gql`
  query Posts {
    posts {
      _id
      content
      images
      createdAt
      author {
        _id
        username
      }
    }
  }
`;
