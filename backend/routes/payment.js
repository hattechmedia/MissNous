const express = require('express');
const { protect } = require('../middleware/auth');
const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/create-intent
router.post('/create-intent', protect, async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid payment amount.' });
    }

    // Stripe expects amount in cents for USD
    const amountInCents = Math.round(Number(amount) * 100);

    if (amountInCents < 50) {
      return res.status(400).json({ message: 'Amount must be at least $0.50 USD.' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: req.user._id.toString(),
        userEmail: req.user.email,
        userName: req.user.name || ''
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    console.error('Stripe create-intent error:', err);
    res.status(500).json({
      message: err.message || 'Failed to initialize payment.'
    });
  }
});

module.exports = router;
