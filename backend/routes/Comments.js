const express = require("express");
const router = express.Router();
const Comment = require("../models/Comments");
const { clerkClient } = require("@clerk/clerk-sdk-node");
require("dotenv").config();

// ✅ Get comments for a blog
router.get("/:blogId", async (req, res) => {
  try {
    // Fetch all comments for the blog
    const comments = await Comment.find({ blogId: req.params.blogId })
      .sort({ createdAt: -1 })
      .lean();

    // Get unique userIds from comments
    const userIds = [...new Set(comments.map((comment) => comment.userId))];

    // Fetch Clerk users by userId (with fail-safe fallback)
    const users = await Promise.all(
      userIds.map(async (userId) => {
        try {
          const user = await clerkClient.users.getUser(userId);
          return { userId, user };
        } catch (err) {
          console.error(`❌ Error fetching Clerk user ${userId}`, err.message);
          return { userId, user: null };
        }
      })
    );

    // Build a map from userId → { author, avatar }
    const userMap = {};
    for (const { userId, user } of users) {
      if (user) {
        userMap[userId] = {
          author:
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.username ||
            "Unknown User",
          avatar: user.imageUrl || "",
        };
      } else {
        userMap[userId] = {
          author: "Unknown User",
          avatar: "",
        };
      }
    }

    // Enrich comments with author and avatar
    const enrichedComments = comments.map((comment) => ({
      ...comment,
      author: userMap[comment.userId]?.author || "Unknown User",
      avatar: userMap[comment.userId]?.avatar || "",
    }));

    res.json(enrichedComments);
  } catch (err) {
    console.error("❌ Error fetching comments:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// ✅ Post a new comment
router.post("/", async (req, res) => {
  try {
    const { blogId, userId, content } = req.body;

    if (!blogId || !userId || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save only userId; enrich data when fetching
    const newComment = await Comment.create({ blogId, userId, content });
    res.status(201).json(newComment);
  } catch (err) {
    console.error("❌ Error posting comment:", err);
    res.status(500).json({ error: "Failed to post comment" });
  }
});

module.exports = router;