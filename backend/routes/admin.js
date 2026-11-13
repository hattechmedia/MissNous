const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const User = require('../models/User');
const Inquiry = require('../models/Inquiry');
const Blog = require('../models/Blog');
const BlogCategory = require('../models/BlogCategory');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/admin/bootstrap - Ultra-fast aggregated overview for the admin panel
// Executes all 7 collections concurrently via .lean() in 1 single HTTP request
router.get('/bootstrap', protect, adminOnly, async (req, res) => {
  try {
    const [products, categories, orders, users, inquiries, blogs, blogCategories] = await Promise.all([
      Product.find().lean().sort({ createdAt: -1 }),
      Category.find().lean().sort({ createdAt: 1 }),
      Order.find().sort({ createdAt: -1 }).populate('user', 'name email').lean(),
      User.find().lean().select('-password').sort({ createdAt: -1 }),
      Inquiry.find().lean().sort({ createdAt: -1 }),
      Blog.find().lean().sort({ createdAt: -1 }),
      BlogCategory.find().lean().sort({ createdAt: 1 })
    ]);

    res.json({
      products: products || [],
      categories: categories || [],
      orders: orders || [],
      users: users || [],
      inquiries: inquiries || [],
      blogs: blogs || [],
      blogCategories: blogCategories || []
    });
  } catch (err) {
    console.error('Admin bootstrap error:', err);
    res.status(500).json({ message: 'Failed to load admin bootstrap data.' });
  }
});

module.exports = router;
