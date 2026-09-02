const express = require('express');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/products - Public: get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
});

// GET /api/products/:id - Public: get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product.' });
  }
});

// POST /api/products - Admin only: add new product
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, subtitle, category, categoryKey, price, stock, rating, reviewsCount, image, description, features } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Product name and price are required.' });
    }

    const product = await Product.create({
      name: name.trim(),
      subtitle: subtitle || '',
      category: category || 'Uncategorized',
      categoryKey: categoryKey || 'uncategorized',
      price: Number(price),
      stock: Number(stock || 0),
      rating: Number(rating || 4.9),
      reviewsCount: Number(reviewsCount || 1),
      image: image || '/product-1-rm.png',
      description: description || '',
      features: Array.isArray(features) ? features : []
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ message: 'Failed to add product.' });
  }
});

// PUT /api/products/:id - Admin only: update product
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product.' });
  }
});

// DELETE /api/products/:id - Admin only: delete product
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product.' });
  }
});

module.exports = router;
