const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true },
    location: { type: String },
    picUrl: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [
      { _id: String, required: true },
      { user: Schema.Types.ObjectId, ref: "User" },
      { text: String, required: true },
      { date: Date, default: Date.now() },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
