const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",        // ← now a reference to the User model
    required: true,
  },
  content: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
});

const Post = model("Post", postSchema);

module.exports = Post;