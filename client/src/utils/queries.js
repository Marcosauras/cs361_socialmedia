import { gql } from "@apollo/client";

export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      img
      posts {
        _id
        author
        content
        createdAt
      }
    }
  }
`;

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

export const GET_POSTS = gql`
  query posts {
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