const { gql } = require("apollo-server-express");
// this is where we define the rules for how apollo server will handle information
const typeDefs = gql`
  type Post {
    _id: ID!
    author: String!
    content: String!
    createdAt: String
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    img: String
    posts: [Post]
    post(postId: ID!): Post
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(_id: String): [User]
    me: User
    posts: [Post]
    post(postId: ID!): Post
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    updateUser(username: String, email: String, img: String, password: String): Auth
    deleteUser(username: String!): Auth

    addPost(author: String!, content: String!): Post
    updatePost(postId: ID!, content: String!): Post
    deletePost(postId: ID!): Post
  }
`;

module.exports = typeDefs;