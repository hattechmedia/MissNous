const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  subtitle: { type: String, default: '', trim: true },
  category: { type: String, default: 'Uncategorized' },
  categoryKey: { type: String, default: 'uncategorized' },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: null },
  discount: { type: String, default: '' },
  stock: { type: Number, default: 0, min: 0 },
  rating: { type: Number, default: 4.9, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 1, min: 0 },
  image: { type: String, default: '/product-1-rm.png' },
  description: { type: String, default: '' },
  features: { type: [String], default: [] }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
