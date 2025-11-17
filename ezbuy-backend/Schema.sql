DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  is_student BOOLEAN DEFAULT false,
  student_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  student_price DECIMAL(10,2),
  image_url TEXT,
  category_id INTEGER REFERENCES categories(id),
  stock_quantity INTEGER DEFAULT 0,
  is_trending BOOLEAN DEFAULT false,
  sales_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  student_discount_applied DECIMAL(10,2) DEFAULT 0,
  shipping_address TEXT,
  payment_status VARCHAR(50) DEFAULT 'pending',
  stripe_payment_id VARCHAR(255),
  order_status VARCHAR(50) DEFAULT 'processing',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10,2) NOT NULL,
  student_discount BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wishlists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (email, full_name, is_student) VALUES 
('demo@example.com', 'Demo User', true);

INSERT INTO categories (name, description, icon) VALUES
('Electronics', 'Laptops, phones, monitors, and accessories', '💻'),
('Home & Living', 'Furniture, decor, and home essentials', '🏠'),
('Fashion', 'Clothing, shoes, and accessories', '👕'),
('Books', 'Textbooks, novels, and study materials', '📚');

INSERT INTO products (name, description, price, student_price, image_url, category_id, stock_quantity, is_trending, sales_count) VALUES
('MacBook Pro 14"', 'Apple M3 Pro chip, 18GB RAM, 512GB SSD', 1999.00, 1699.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 1, 50, true, 245),
('27-inch 4K Monitor', 'Ultra HD 4K display with HDR support', 349.99, 279.99, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', 1, 30, true, 189),
('Wireless Noise-Canceling Headphones', 'Premium sound quality with ANC', 299.00, 239.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 1, 75, false, 423),
('Ergonomic Office Chair', 'Lumbar support, adjustable height', 249.00, 199.00, 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500', 2, 20, true, 156),
('Standing Desk', 'Electric height adjustable desk', 599.00, 499.00, 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=500', 2, 15, false, 87),
('Modern LED Desk Lamp', 'Touch control with multiple brightness levels', 49.99, 39.99, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', 2, 100, false, 312),
('Backpack', 'Water-resistant laptop backpack', 79.99, 59.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 3, 60, true, 267),
('Sneakers', 'Comfortable running shoes', 89.99, 69.99, 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500', 3, 45, false, 198),
('Calculus Textbook', 'Advanced mathematics for university students', 129.99, 99.99, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500', 4, 25, false, 89),
('Programming Guide', 'Complete Python programming reference', 59.99, 44.99, 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500', 4, 40, false, 156);

INSERT INTO carts (user_id) VALUES (1);