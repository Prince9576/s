const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");
const FollowerModel = require("../models/FollowerModel");
const PostModel = require("../models/PostModel");

// POST
router.post("/", authMiddleware, async (req, res) => {
  const { text, picUrl, location } = req.body;
  if (text.length < 1)
    return res.status(401).send("Post must be greater than 1 letter");
  try {
    const newPost = {
      user: req.userId,
    };
    if (picUrl) newPost.picUrl = picUrl;
    if (location) newPost.location = location;
    const post = await new PostModel(newPost).save();
    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
