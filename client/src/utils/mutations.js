import { gql } from "@apollo/client";
//  This mutation logs in a user and returns the token and user data
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
// This mutation adds a new user and returns the token and user data
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

// This mutation updates user information and returns the updated user and token
export const UPDATE_USER = gql`
  mutation updateUser($img: String) {
    updateUser(img: $img) {
      token
      user {
        _id
        username
        email
        img
        location
      }
    }
  }
`;
// This mutation deletes a user by username and returns the user's token
export const DELETE_USER = gql`
  mutation Mutation($username: String!) {
    deleteUser(username: $username) {
      location
    }
  }
`;
// This mutation adds a new post and returns the created post
export const ADD_POST = gql`
  mutation addPost($content: String!, $images: [String]) {
    addPost(content: $content, images: $images) {
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
// This mutation updates a post by its ID and returns the updated post
export const UPDATE_POST = gql`
  mutation updatePost($postId: ID!, $content: String!) {
    updatePost(postId: $postId, content: $content) {
      _id
      content
      images
      createdAt
      author {
        username
      }
    }
  }
`;
// This mutation deletes a post by its ID and returns the deleted post's ID
export const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId) {
      _id
    }
  }
`;