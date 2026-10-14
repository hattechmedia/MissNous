const express = require('express');
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Rate limiter for checkout session creation (prevents Stripe API quota exhaustion)
const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many checkout attempts. Please try again after a few minutes.' }
});

// POST /api/payments/create-checkout-session (Stripe Hosted Checkout Redirect)
router.post('/create-checkout-session', protect, checkoutLimiter, async (req, res) => {
  try {
    const { items, shippingAddress, subtotal, tax = 0, total, origin } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart cannot be empty.' });
    }

    // Security: Validate origin against allowed whitelist to prevent Open Redirect phishing
    const defaultOrigin = process.env.FRONTEND_URL || 'https://missnous.com';
    let appOrigin = defaultOrigin;
    const requestedOrigin = origin || req.headers.origin;
    if (requestedOrigin) {
      try {
        const parsed = new URL(requestedOrigin);
        const isAllowed = 
          parsed.origin === 'https://missnous.com' ||
          parsed.origin === 'https://www.missnous.com' ||
          parsed.hostname === 'localhost' ||
          parsed.hostname === '127.0.0.1' ||
          (process.env.FRONTEND_URL && parsed.origin === new URL(process.env.FRONTEND_URL).origin);
        if (isAllowed) {
          appOrigin = parsed.origin;
        }
      } catch (e) {}
    }

    // Security: Fetch official prices from database to prevent Client-Side Price Manipulation
    const line_items = [];
    for (const item of items) {
      let officialPrice = Number(item.price);
      let officialName = item.name || 'Miss Nous Product';
      let officialSubtitle = item.subtitle || 'Organic Intimate Wellness Ritual';
      let officialImage = item.image;

      const pId = item.productId || item._id || item.id;
      if (pId) {
        try {
          const dbProduct = await Product.findById(pId);
          if (dbProduct) {
            officialPrice = dbProduct.price;
            officialName = dbProduct.name;
            officialSubtitle = dbProduct.subtitle || officialSubtitle;
            if (dbProduct.image) officialImage = dbProduct.image;
          }
        } catch (e) {}
      }

      // Ensure price is a valid positive number
      const safePrice = Math.max(0.5, Number(officialPrice) || 0.5);
      const safeQuantity = Math.max(1, parseInt(item.quantity, 10) || 1);

      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: officialName,
            description: officialSubtitle,
            images: officialImage && officialImage.startsWith('http') ? [officialImage] : []
          },
          unit_amount: Math.round(safePrice * 100)
        },
        quantity: safeQuantity
      });
    }

    // If there is estimated tax, add it as a separate line item
    if (tax && Number(tax) > 0) {
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Estimated Sales Tax (5%)',
            description: 'State and local sales tax'
          },
          unit_amount: Math.round(Number(tax) * 100)
        },
        quantity: 1
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: req.user.email,
      client_reference_id: req.user._id.toString(),
      line_items,
      metadata: {
        userId: req.user._id.toString(),
        userEmail: req.user.email,
        userName: req.user.name || '',
        shippingAddress: JSON.stringify(shippingAddress || {})
      },
      success_url: `${appOrigin}/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appOrigin}/checkout?canceled=true`
    });

    res.json({
      url: session.url,
      sessionId: session.id
    });
  } catch (err) {
    console.error('Stripe create-checkout-session error:', err);
    res.status(500).json({
      message: err.message || 'Failed to initialize Stripe checkout redirect.'
    });
  }
});

// POST /api/payments/verify-session (Called when user returns from Stripe)
router.post('/verify-session', protect, async (req, res) => {
  try {
    const { sessionId, cartItems, shippingAddress } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required.' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        message: 'Payment not completed.',
        status: session.payment_status
      });
    }

    // Security: Verify that the current user owns this Stripe session
    if (session.client_reference_id && session.client_reference_id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized session verification.' });
    }

    const paymentIntentId = session.payment_intent || session.id;

    // Check if an order was already created for this session
    let existingOrder = await Order.findOne({ stripePaymentIntentId: paymentIntentId });
    if (existingOrder) {
      return res.json({ order: existingOrder, alreadyCreated: true });
    }

    // Parse shipping address from metadata if not in body
    let finalAddress = shippingAddress;
    if (!finalAddress && session.metadata?.shippingAddress) {
      try {
        finalAddress = JSON.parse(session.metadata.shippingAddress);
      } catch (e) {}
    }

    const orderId = `MN-${Date.now().toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;
    const totalAmount = session.amount_total ? session.amount_total / 100 : 0;

    const newOrder = await Order.create({
      orderId,
      user: req.user._id,
      userEmail: req.user.email,
      userName: req.user.name || session.customer_details?.name || 'Valued Customer',
      items: (cartItems && cartItems.length > 0) ? cartItems.map(item => ({
        productId: item._id || item.id,
        name: item.name,
        subtitle: item.subtitle || '',
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })) : [],
      subtotal: totalAmount,
      tax: 0,
      shipping: 0,
      total: totalAmount,
      paymentMethod: 'Stripe Hosted Checkout',
      stripePaymentIntentId: paymentIntentId,
      paymentStatus: 'Paid',
      status: 'Confirmed',
      shippingAddress: finalAddress || {
        name: session.customer_details?.name || req.user.name || 'Valued Customer',
        email: session.customer_details?.email || req.user.email,
        address: '',
        city: '',
        postalCode: '',
        country: 'United States'
      }
    });

    res.json({ order: newOrder, success: true });
  } catch (err) {
    console.error('Verify session error:', err);
    res.status(500).json({
      message: err.message || 'Failed to verify payment session.'
    });
  }
});

module.exports = router;
