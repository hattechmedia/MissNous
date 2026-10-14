const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/users - Admin: get all users
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

// GET /api/users/me - Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
});

// PUT /api/users/me - Update own profile
router.put('/me', protect, async (req, res) => {
  try {
    const { name, phone, address, city, country, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address, city, country, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile.' });
  }
});

const rateLimit = require('express-rate-limit');

// Rate limiter for password change attempts (prevents brute-force current password guessing)
const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many password update attempts. Please try again after 15 minutes.' }
});

// PUT /api/users/me/password - Change own password
router.put('/me/password', protect, passwordChangeLimiter, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update password.' });
  }
});

// PUT /api/users/:id - Admin: update user safely (prevents mass assignment & self-lockout)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, phone, address, city, country, avatar, role } = req.body;

    // Security: Prevent admin from accidentally demoting themselves
    if (req.params.id === req.user._id.toString() && role && role !== 'admin') {
      return res.status(400).json({ message: 'You cannot remove admin privileges from your own account.' });
    }

    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (country !== undefined) updateData.country = country;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (role !== undefined && ['user', 'admin'].includes(role)) {
      updateData.role = role;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user.' });
  }
});

// DELETE /api/users/:id - Admin: delete user safely
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    // Security: Prevent admin from accidentally deleting their own account
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account while logged in.' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user.' });
  }
});

module.exports = router;
