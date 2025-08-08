const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    role: String!
    profileImg: String
    posts: [Post]
  }

  type Post {
    _id: ID!
    content: String!
    images: [String]
    createdAt: String
    author: User!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(_id: ID!): User
    me: User
    posts: [Post]
    post(postId: ID!): Post
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    updateUser(
      username: String
      email: String
      profileImg: String
      password: String
    ): Auth
    deleteUser(username: String!): User
    addPost(content: String!, images: [String]): Post
    updatePost(postId: ID!, content: String!, images: [String]): Post
    deletePost(postId: ID!): Post
  }
`;

module.exports = typeDefs;
