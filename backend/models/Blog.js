const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Blog slug is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    trim: true,
    default: ''
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  coverImage: {
    type: String,
    default: '/gpt-8.jpeg'
  },
  category: {
    type: String,
    default: 'Wellness',
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  author: {
    type: String,
    default: 'Miss Nous Team',
    trim: true
  },
  readTime: {
    type: String,
    default: '5 min read'
  },
  date: {
    type: String,
    default: () => new Date().toISOString()
  },
  status: {
    type: String,
    enum: ['Published', 'Draft'],
    default: 'Published'
  },
  featured: {
    type: Boolean,
    default: false
  },
  metaTitle: {
    type: String,
    default: ''
  },
  metaDescription: {
    type: String,
    default: ''
  },
  keywords: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);
