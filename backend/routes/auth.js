const express = require('express');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const router = express.Router();

const User = require('../models/User'); // Replace with your User model

// User login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

    // Generate JWT token
    const token = generateToken({ id: user._id, email: user.email });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

module.exports = router;
