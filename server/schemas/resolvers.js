const { AuthenticationError } = require("apollo-server-express");
const { UserInputError } = require("apollo-server-errors");
const { User, Post } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    users: async () => User.find().populate("posts"),
    user: async (parent, { _id }) =>
      User.findById(_id).populate("posts"),
    me: async (parent, args, context) => {
      if (!context.user) throw new AuthenticationError("Not logged in");
      return User.findById(context.user._id)
        .select("-__v -password")
        .populate("posts");
    },
    posts: async () => Post.find(),
    post: async (parent, { postId }) => Post.findById(postId),
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      let user = await User.findOne({ username });
      if (user) username = `${username}${Math.floor(Math.random() * 1000)}`;
      user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email }).populate("posts");
      if (!user) throw new AuthenticationError("Incorrect credentials");

      const valid = await user.checkPassword(password);
      if (!valid) throw new AuthenticationError("Incorrect credentials");

      const token = signToken(user);
      return { token, user };
    },

    deleteUser: async (parent, { username }) => {
      const user = await User.findOne({ username });
      if (!user) throw new UserInputError("User not found");
      await Post.deleteMany({ _id: { $in: user.posts } });
      await User.deleteOne({ _id: user._id });
      return { token: signToken(user), user };
    },

    addPost: async (parent, { author, content }) => {
      const post = await Post.create({ author, content });
      await User.findOneAndUpdate(
        { username: author },
        { $push: { posts: post._id } },
        { new: true }
      );
      return post;
    },

    updatePost: async (parent, { postId, content }) =>
      Post.findByIdAndUpdate(postId, { content }, { new: true }),

    deletePost: async (parent, { postId }) =>
      Post.findByIdAndDelete(postId),
  },
};

module.exports = resolvers;