const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const postsSchema = new Schema({
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    minlength: 10,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
});

const Posts = model("Posts", postsSchema);

module.exports = Posts;