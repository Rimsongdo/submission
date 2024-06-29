
const express = require('express');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');
const { SECRET } = require('../utils/config');

const getTokenFrom = request => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Create a new blog
router.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body;
  const token = getTokenFrom(req);

  try {
    const decodedToken = jwt.verify(token, "secret");
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' });
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(401).json({ error: 'user not found' });
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user._id
    });
    
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    res.status(201).json(savedBlog);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'token invalid' });
    }
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.put('/:id', async (req, res) => {
    const { title, author, url, likes } = req.body;
    const token = getTokenFrom(req);
  
    try {
      const decodedToken = jwt.verify(token, "secret");
      if (!decodedToken.id) {
        return res.status(401).json({ error: 'token invalid' });
      }
  
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ error: 'blog not found' });
      }
  
      const updatedBlog = {
        title,
        author,
        url,
        likes: likes || 0,
        user: blog.user // Keep the same user
      };
  
      const savedBlog = await Blog.findByIdAndUpdate(req.params.id, updatedBlog, { new: true });
      res.json(savedBlog);
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'token invalid' });
      }
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  

module.exports = router;
