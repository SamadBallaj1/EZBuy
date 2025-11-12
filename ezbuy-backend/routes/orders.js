import express from 'express';
import { pool } from '../server.js';

const router = express.Router();

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(`
      SELECT o.*, 
        json_agg(
          json_build_object(
            'product_id', oi.product_id,
            'product_name', p.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'image_url', p.image_url
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const itemsResult = await pool.query(`
      SELECT oi.*, p.name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `, [id]);
    
    const order = orderResult.rows[0];
    order.items = itemsResult.rows;
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { user_id, items, total_amount, stripe_payment_id } = req.body;
    
    await client.query('BEGIN');
    
    const orderResult = await client.query(`
      INSERT INTO orders (user_id, total_amount, status, stripe_payment_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [user_id, total_amount, 'completed', stripe_payment_id]);
    
    const order = orderResult.rows[0];
    
    for (const item of items) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
      `, [order.id, item.product_id, item.quantity, item.price]);
    }
    
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [user_id]);
    
    await client.query('COMMIT');
    
    res.status(201).json(order);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(`
      UPDATE orders 
      SET status = $1
      WHERE id = $2
      RETURNING *
    `, [status, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ message: 'Order deleted successfully', order: result.rows[0] });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router;
