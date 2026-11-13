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

blogCategorySchema.pre('validate', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
  next();
});

blogCategorySchema.index({ createdAt: 1 });

module.exports = mongoose.model('BlogCategory', blogCategorySchema);
