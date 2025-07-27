import { gql } from "@apollo/client";
//  This query retrieves the currently logged-in user's profile
export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      img
      location
      posts {
        _id
        content
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
  query singleUser($_id: String) {
    user(_id: $_id) {
      _id
      username
      posts {
        _id
        author
        content
        createdAt
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
      createdAt
      author {
        _id
        username
      }
    }
  }
`;