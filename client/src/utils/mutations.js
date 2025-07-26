import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;


export const UPDATE_USER = gql`
  mutation updateUser(
    $username: String
    $email: String
    $img: String
  ) {
    updateUser(
      username: $username
      email: $email
      img: $img
    ) {
      token
      user {
        username
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation Mutation($username: String!) {
    deleteUser(username: $username) {
      location
    }
  }
`;

export const ADD_POST = gql`
  mutation addPost($author: String!, $content: String!) {
    addPost(author: $author, content: $content) {
      _id
      author
      content
      createdAt
    }
  }
`;