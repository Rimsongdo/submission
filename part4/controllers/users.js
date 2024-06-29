
const bcrypt = require('bcrypt')
const express = require('express');
const User = require('../models/user');
const Blog = require('../models/blog');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs');
  res.json(users);
});

// Create a new user
router.post('/', async (req, res) => {
  const { username, name, password } = req.body;
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({ username, name, passwordHash });
  const savedUser = await user.save();
  res.status(201).json(savedUser);
});


module.exports = router;
