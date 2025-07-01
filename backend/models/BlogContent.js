// models/BlogContent.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const BlogSchema = new Schema({
  title:       { type: String, required: true },
  coverImage:  { type: String, required: true },
  content:     { type: String, required: true },
  category:{type:String,required:true},
  writingDate: { type: Date,   default: Date.now },
  status: { type: String, required: true }, 
  userId: {
    type: String,
    required: true, // Clerk user ID
  },
}, {
    timestamps: true
  });

module.exports = mongoose.model("BlogContent", BlogSchema);