const mongoose = require('mongoose');

const blogCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Blog category name is required'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: [true, 'Blog category slug is required'],
    trim: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true
});

blogCategorySchema.index({ createdAt: 1 });

module.exports = mongoose.model('BlogCategory', blogCategorySchema);
