import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected');
  }
});

app.use(cors());

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
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
        [user_id || null, paymentIntent.amount / 100, shipping_address, 'completed', paymentIntent.id, 'processing']
      );

      const orderId = orderResult.rows[0].id;

      for (const item of parsedItems) {
        await pool.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)`,
          [orderId, item.id, item.quantity, item.price]
        );
      }
    } catch (dbError) {
      console.error('Database error in webhook:', dbError);
    }
  }

  res.json({ received: true });
});

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.post('/api/stripe/create-payment-intent', async (req, res) => {
  try {
    const { amount, items, user_id, shipping_address } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        user_id: user_id?.toString(),
        items: JSON.stringify(items),
        shipping_address,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, name, is_student } = req.body;
    
    if (is_student && !email.endsWith('.edu')) {
      return res.status(400).json({ error: 'Student email must end with .edu' });
    }
    
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const result = await pool.query(
      `INSERT INTO users (email, name, is_student) VALUES ($1, $2, $3) RETURNING *`,
      [email, name, is_student]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in' });
  }
});

app.get('/api/users/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/trending', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE is_trending = true ORDER BY id LIMIT 4');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending products' });
  }
});

app.get('/api/products/bestsellers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY sales_count DESC LIMIT 4');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bestsellers' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/orders', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { user_id = 1, items, total_amount, student_discount_applied = 0, shipping_address } = req.body;
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, order_number, total_amount, student_discount_applied, shipping_address, payment_status, order_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [user_id, orderNumber, total_amount, student_discount_applied, shipping_address, 'completed', 'processing']
    );
    
    const order = orderResult.rows[0];
    
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)`,
        [order.id, item.id, item.quantity, item.price]
      );
    }
    
    await client.query('COMMIT');
    res.status(201).json(order);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
});

app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const ordersResult = await pool.query(
      `SELECT o.*, json_agg(json_build_object('product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price_at_purchase, 'name', p.name, 'image', p.image_url)) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    );
    
    res.json(ordersResult.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/reset', async (req, res) => {
  try {
    await pool.query('TRUNCATE orders, order_items RESTART IDENTITY CASCADE');
    res.json({ message: 'Database reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});