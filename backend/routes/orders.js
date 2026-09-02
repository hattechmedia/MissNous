const express = require('express');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/orders - Admin gets all, User gets their own
router.get('/', protect, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'admin') {
      orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
    } else {
      orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});

// POST /api/orders - Create new order (logged-in user)
router.post('/', protect, async (req, res) => {
  try {
    const { items, subtotal, tax, shipping, total, paymentMethod, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item.' });
    }

    const orderId = `MN-${Math.floor(10000 + Math.random() * 90000)}`;

    const order = await Order.create({
      orderId,
      user: req.user._id,
      userEmail: req.user.email,
      userName: req.user.name,
      items,
      subtotal: subtotal || 0,
      tax: tax || 0,
      shipping: shipping || 0,
      total,
      paymentMethod: paymentMethod || 'Cash on Delivery (COD)',
      paymentStatus: 'Pending',
      status: 'Pending',
      shippingAddress
    });

    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ message: 'Failed to create order.' });
  }
});

// PUT /api/orders/:id/status - Admin: update order status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status.' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status.' });
  }
});

// PUT /api/orders/:id/payment - Admin: update payment status
router.put('/:id/payment', protect, adminOnly, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const validStatuses = ['Pending', 'Paid', 'Refunded', 'Failed'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status.' });
    }

    // Auto-update order status based on payment
    let statusUpdate = {};
    if (paymentStatus === 'Refunded') statusUpdate.status = 'Cancelled';
    else if (paymentStatus === 'Paid') statusUpdate.status = 'Confirmed';

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, ...statusUpdate },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update payment status.' });
  }
});

module.exports = router;
