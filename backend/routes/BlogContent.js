// routes/blogs.js
const express = require("express");
const router  = express.Router();
const Blog    = require("../models/BlogContent");

// POST /api/blogs
router.post("/", async (req, res) => {
  try {
    const { title, coverImage, content,category,status,userId } = req.body;
    if (!title || !coverImage || !content|| !userId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const blog = new Blog({ title, coverImage, content,category,status ,userId});
    const saved = await blog.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error saving blog." });
  }
});

// GET /api/blogs
router.get("/", async (req, res) => {
    try {
      const { userId } = req.query;
  
      if (!userId) {
        return res.status(400).json({ error: "Missing userId." });
      }
  
      const blogs = await Blog.find({ userId }).sort({ createdAt: -1 });
      res.status(200).json(blogs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch blogs." });
    }
  });
  // GET /api/blogs/all
router.get("/all", async (req, res) => {
    try {
      const blogs = await Blog.find().sort({ createdAt: -1 });
      res.status(200).json(blogs);
    } catch (err) {
      console.error("Error fetching all blogs:", err);
      res.status(500).json({ error: "Failed to fetch blogs." });
    }
  });

  // GET /api/blogs/:id
router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ error: "Missing blog ID." });
      }
  
      const blog = await Blog.findById(id);
  
      if (!blog) {
        return res.status(404).json({ error: "Blog not found." });
      }
  
      res.status(200).json(blog);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch blog." });
    }
  });
// PUT /api/blogs/:id
// Example using Express.js and Mongoose
router.put("/:id", async (req, res) => {
    try {
      const { title, content, coverImage, status ,category} = req.body;
  
      const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        {
          title,
          content,
          coverImage,// ✅ ensure this is defined from req.body
          category,
          status
        },
        { new: true }
      );
  
      if (!updatedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      res.json(updatedBlog);
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({ message: "Failed to update blog" });
    }
  });

  // DELETE /api/blogs/:id
router.delete("/:id", async (req, res) => {
    try {
      const deleted = await Blog.findByIdAndDelete(req.params.id);
  
      if (!deleted) {
        return res.status(404).json({ error: "Blog not found." });
      }
  
      res.status(200).json({ message: "Blog deleted successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete blog." });
    }
  });


  router.get('/category/:categoryName', async (req, res) => {
    const category = req.params.categoryName;
    try {
      const blogs = await Blog.find({ category });
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blogs by category' });
    }
  });

module.exports = router;