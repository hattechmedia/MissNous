const express = require('express');
const rateLimit = require('express-rate-limit');
const Inquiry = require('../models/Inquiry');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Rate limiter for contact form submissions (prevents contact form spam)
const contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // max 10 submissions per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many messages sent from this IP. Please try again after an hour.' }
});

// POST /api/inquiries - Public (Customer submits Contact Form)
router.post('/', contactFormLimiter, async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide your name, email, and message.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (message.trim().length < 5) {
      return res.status(400).json({ message: 'Message must be at least 5 characters long.' });
    }

    const inquiry = await Inquiry.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      subject: subject && subject.trim() ? subject.trim() : 'Product / Order Inquiry',
      message: message.trim(),
      ip: req.ip || ''
    });

    res.status(201).json({
      message: 'Your inquiry has been received. Our concierge team will reach out shortly!',
      inquiry: {
        _id: inquiry._id,
        name: inquiry.name,
        email: inquiry.email,
        subject: inquiry.subject,
        createdAt: inquiry.createdAt
      }
    });
  } catch (err) {
    console.error('Contact inquiry error:', err.message);
    res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
});

// GET /api/inquiries - Admin Only (Fetch all customer inquiries)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch inquiries.' });
  }
});

// PUT /api/inquiries/:id/status - Admin Only (Update inquiry status: Unread / Read / Replied)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Unread', 'Read', 'Replied'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid inquiry status.' });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }

    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update inquiry status.' });
  }
});

// DELETE /api/inquiries/:id - Admin Only (Delete inquiry)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }
    res.json({ message: 'Inquiry deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete inquiry.' });
  }
});

module.exports = router;
