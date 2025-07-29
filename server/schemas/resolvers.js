const { AuthenticationError } = require("apollo-server-express");
const { UserInputError } = require("apollo-server-errors");
const { User, Post } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // Fetch all users and their posts
    users: async () => await User.find().populate("posts"),
    user: async (parent, { _id }) => await User.findById(_id).populate("posts"),
    // Fetch the currently logged-in user
    me: async (parent, _args, context) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in");
      }
      return await User.findById(context.user._id)
        .select("-__v -password")
        .populate("posts");
    },

    posts: async () => await Post.find().populate("author"),

    post: async (parent, { postId }) =>
      await Post.findById(postId).populate("author"),
  },

  Mutation: {
    // Create a new user and return a token
    addUser: async (parent, { username, email, password }) => {
      let user = await User.findOne({ username });
      if (user) {
        username = `${username}${Math.floor(Math.random() * 1000)}`;
      }
      user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    // Update user information and return a token
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email }).populate("posts");
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const valid = await user.checkPassword(password);
      if (!valid) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },
    // Update user information
    deleteUser: async (parent, { username }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new UserInputError("User not found");
      }
      await Post.deleteMany({ _id: { $in: user.posts } });
      await User.deleteOne({ _id: user._id });
      return { token: signToken(user), user };
    },

    // Update user information
    addPost: async (parent, { content, images }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in to post");
      }
      const post = await Post.create({
        author: context.user._id,
        content,
        images: images || [],
      });
      await User.findByIdAndUpdate(
        context.user._id,
        { $push: { posts: post._id } },
        { new: true }
      );
      return await post.populate("author");
    },
    updateUser: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to update your profile."
        );
      }
      const user = await User.findById(context.user._id);
      if (!user) {
        throw new UserInputError("User not found");
      }
      const { username, email, profileImg, password } = args;
      if (username) user.username = username;
      if (email) user.email = email;
      if (profileImg) user.profileImg = profileImg;
      if (password) user.password = password;

      const updatedUser = await user.save();
      const token = signToken(updatedUser);

      return { token, user: updatedUser };
    },
    updatePost: async (parent, { postId, content }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in to update a post");
      }
      const updated = await Post.findByIdAndUpdate(
        postId,
        { content },
        { new: true }
      ).populate("author");
      if (!updated) {
        throw new UserInputError("Post not found");
      }
      return updated;
    },

    deletePost: async (parent, { postId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in to delete a post");
      }
      const deleted = await Post.findByIdAndDelete(postId);
      if (!deleted) {
        throw new UserInputError("Post not found");
      }
      await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { posts: postId } },
        { new: true }
      );
      return deleted;
    },
  },
};

module.exports = resolvers;
