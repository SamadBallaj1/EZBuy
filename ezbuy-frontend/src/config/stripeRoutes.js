import express from 'express';
import Stripe from 'stripe';
import pool from '../config/db.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, items, user_id, shipping_address } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        user_id: user_id?.toString(),
        items: JSON.stringify(items),
        shipping_address,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    try {
      const { user_id, items, shipping_address } = paymentIntent.metadata;
      const parsedItems = JSON.parse(items);

      const orderResult = await pool.query(
        `INSERT INTO orders (user_id, total_amount, shipping_address, payment_status, stripe_payment_id, order_status)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          user_id || null,
          paymentIntent.amount / 100,
          shipping_address,
          'completed',
          paymentIntent.id,
          'processing',
        ]
      );

      const orderId = orderResult.rows[0].id;

      for (const item of parsedItems) {
        await pool.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
           VALUES ($1, $2, $3, $4)`,
          [orderId, item.id, item.quantity, item.price]
        );
      }

      console.log('Order created:', orderId);
    } catch (dbError) {
      console.error('Database error in webhook:', dbError);
    }
  }

  res.json({ received: true });
});

router.get('/config', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

export default router;