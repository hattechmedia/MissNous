const express = require('express');
const Category = require('../models/Category');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/categories - Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories.' });
  }
});

// POST /api/categories - Admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, key, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    // Auto-generate key from name if not provided
    const categoryKey = (key || name)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if key already exists
    const existing = await Category.findOne({ key: categoryKey });
    if (existing) {
      return res.status(400).json({ message: `Category "${name}" already exists.` });
    }

    const category = await Category.create({
      name: name.trim(),
      key: categoryKey,
      description: (description || '').trim()
    });
    res.status(201).json(category);
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ message: err.message || 'Failed to create category.' });
  }
});

// PUT /api/categories/:id - Admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, key, description } = req.body;
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (key) {
      updateData.key = key.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    } else if (name) {
      updateData.key = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update category.' });
  }
});

// DELETE /api/categories/:id - Admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.json({ message: 'Category deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete category.' });
  }
});

module.exports = router;
