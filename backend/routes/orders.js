const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
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
    const { items, shipping, paymentMethod, shippingAddress, stripePaymentIntentId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item.' });
    }

    const orderId = `MN-${Date.now().toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;

    // Security: Recalculate prices from database to prevent price tampering
    let calculatedSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      let unitPrice = Number(item.price) || 0;
      let itemName = item.name || 'Product';
      let itemSubtitle = item.subtitle || '';
      let itemImage = item.image || '';

      const pId = item.productId || item._id || item.id;
      if (pId) {
        try {
          const dbProduct = await Product.findById(pId);
          if (dbProduct) {
            unitPrice = dbProduct.price;
            itemName = dbProduct.name;
            itemSubtitle = dbProduct.subtitle || itemSubtitle;
            if (dbProduct.image) itemImage = dbProduct.image;
          }
        } catch (e) {}
      }

      const safeQty = Math.max(1, parseInt(item.quantity, 10) || 1);
      calculatedSubtotal += unitPrice * safeQty;

      verifiedItems.push({
        productId: pId ? pId.toString() : '',
        name: itemName,
        subtitle: itemSubtitle,
        price: unitPrice,
        quantity: safeQty,
        image: itemImage
      });
    }

    const calculatedTax = Math.round(calculatedSubtotal * 0.05 * 100) / 100;
    const calculatedShipping = Number(shipping) || 0;
    const calculatedTotal = Math.round((calculatedSubtotal + calculatedTax + calculatedShipping) * 100) / 100;

    const isStripe = Boolean(stripePaymentIntentId);

    const order = await Order.create({
      orderId,
      user: req.user._id,
      userEmail: req.user.email,
      userName: req.user.name,
      items: verifiedItems,
      subtotal: calculatedSubtotal,
      tax: calculatedTax,
      shipping: calculatedShipping,
      total: calculatedTotal,
      paymentMethod: paymentMethod || 'Standard Checkout',
      stripePaymentIntentId: stripePaymentIntentId || null,
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
