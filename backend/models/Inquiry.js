const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    maxlength: 150
  },
  phone: {
    type: String,
    default: '',
    trim: true,
    maxlength: 30
  },
  subject: {
    type: String,
    default: 'General Inquiry',
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: 5000
  },
  status: {
    type: String,
    enum: ['Unread', 'Read', 'Replied'],
    default: 'Unread'
  },
  ip: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Performance Indexes: Fast sorting and filtering in Admin Panel
inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ status: 1 });

module.exports = mongoose.model('Inquiry', inquirySchema);
