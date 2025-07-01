const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema({
  blogId:   { type: Schema.Types.ObjectId, ref: "BlogContent", required: true },
  userId:   { type: String, required: true },
  author:   { type: String }, // Optional Clerk user name
  avatar:   { type: String }, // Optional Clerk user image
  content:  { type: String, required: true },
  createdAt:{ type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", CommentSchema);