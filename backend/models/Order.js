const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String },
  name: { type: String },
  subtitle: { type: String },
  price: { type: Number },
  quantity: { type: Number },
  image: { type: String }
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  address: { type: String },
  city: { type: String },
  postalCode: { type: String },
  country: { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: { type: String, required: true },
  userName: { type: String },
  items: [orderItemSchema],
  subtotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Cash on Delivery (COD)' },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded', 'Failed'],
    default: 'Pending'
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  shippingAddress: shippingAddressSchema
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
