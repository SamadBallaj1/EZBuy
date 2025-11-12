import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.stack);
  } else {
    console.log('✅ Connected to PostgreSQL database');
    release();
  }
});

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EZBuy API is running' });
});

app.post('/api/reset', async (req, res) => {
  try {
    await pool.query('DROP TABLE IF EXISTS order_items CASCADE');
    await pool.query('DROP TABLE IF EXISTS orders CASCADE');
    await pool.query('DROP TABLE IF EXISTS cart_items CASCADE');
    await pool.query('DROP TABLE IF EXISTS products CASCADE');
    await pool.query('DROP TABLE IF EXISTS categories CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');

    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        is_student BOOLEAN DEFAULT false,
        github_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category_id INTEGER REFERENCES categories(id),
        description TEXT,
        specs TEXT,
        price DECIMAL(10, 2) NOT NULL,
        student_price DECIMAL(10, 2),
        image_url TEXT,
        colors TEXT[],
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `);

    await pool.query(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        stripe_payment_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      INSERT INTO categories (name, slug, description) VALUES
      ('Electronics', 'electronics', 'Latest tech gadgets and devices'),
      ('Accessories', 'accessories', 'Essential accessories for your devices'),
      ('Audio', 'audio', 'Premium sound equipment')
    `);

    await pool.query(`
      INSERT INTO products (name, category_id, description, specs, price, student_price, image_url, colors, stock) VALUES
      ('Wireless Headphones', 1, 'High-quality wireless headphones with active noise cancellation and deep bass.', 'Bluetooth 5.0 • 20h Battery • Noise Cancelling • Fast Charging', 59.99, 49.99, '/assets/headphones.jpg', ARRAY['Black', 'White', 'Blue'], 50),
      ('Smart Watch', 1, 'Stay connected and track your fitness with our sleek smartwatch.', 'Heart Rate • GPS • Waterproof • Step Counter', 99.99, 79.99, '/assets/watch.jpg', ARRAY['Silver', 'Gold', 'Black'], 30),
      ('Laptop Stand', 2, 'Adjustable aluminum laptop stand for better posture and cooling.', 'Aluminum • Foldable • Fits 11–17 inch laptops', 29.99, 24.99, '/assets/laptop-stand.jpg', ARRAY['Silver', 'Gray'], 100),
      ('Bluetooth Speaker', 3, 'Compact and powerful Bluetooth speaker with deep bass and long battery life.', 'Bluetooth 5.1 • 12h Playtime • Water Resistant', 39.99, 29.99, '/assets/speaker.jpg', ARRAY['Black', 'Red', 'Blue'], 75),
      ('Gaming Mouse', 1, 'Ergonomic RGB gaming mouse with customizable DPI and side buttons.', 'RGB Lighting • 6 Buttons • 16000 DPI • Wired', 49.99, 39.99, '/assets/gaming-mouse.jpg', ARRAY['Black', 'White'], 60),
      ('USB-C Hub', 2, 'Multiport USB-C hub with HDMI, USB 3.0, and SD card reader.', 'HDMI • 3x USB 3.0 • SD/TF Reader • PD Charging', 24.99, 19.99, '/assets/usb-hub.jpg', ARRAY['Gray', 'Silver'], 120),
      ('Mechanical Keyboard', 1, 'RGB mechanical keyboard with tactile switches for ultimate typing feel.', 'RGB Lighting • Blue Switches • USB-C • Full Key Rollover', 79.99, 64.99, '/assets/keyboard.jpg', ARRAY['Black', 'White'], 40),
      ('Noise Cancelling Earbuds', 3, 'Compact true wireless earbuds with hybrid noise cancellation.', 'Bluetooth 5.2 • 8h Battery • Wireless Charging', 89.99, 69.99, '/assets/earbuds.jpg', ARRAY['Black', 'White', 'Pink'], 85)
    `);

    res.json({ message: '✅ Database reset successfully' });
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});