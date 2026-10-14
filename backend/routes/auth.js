const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const router = express.Router();

// Strict rate limiter for login attempts (prevents brute force credential stuffing)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' }
});

// Rate limiter for account creation (prevents bot registration spam)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // max 10 accounts created per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many account creation attempts. Please try again later.' }
});

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/register
router.post('/register', registerLimiter, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists. Please log in.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone ? phone.trim() : '',
      role: 'user'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: user.toJSON()
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    // Security: Generic error message to prevent user/email enumeration
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful.',
      token,
      user: user.toJSON()
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;
