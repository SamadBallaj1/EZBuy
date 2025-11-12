import express from 'express';
import { pool } from '../server.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(`
      SELECT ci.*, p.name, p.description, p.price, p.student_price, p.image_url, p.colors
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
    `, [userId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    
    const existingItem = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [user_id, product_id]
    );
    
    let result;
    if (existingItem.rows.length > 0) {
      result = await pool.query(`
        UPDATE cart_items 
        SET quantity = quantity + $1
        WHERE user_id = $2 AND product_id = $3
        RETURNING *
      `, [quantity, user_id, product_id]);
    } else {
      result = await pool.query(`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *
      `, [user_id, product_id, quantity]);
    }
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    const result = await pool.query(`
      UPDATE cart_items 
      SET quantity = $1
      WHERE id = $2
      RETURNING *
    `, [quantity, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM cart_items WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    res.json({ message: 'Item removed from cart', item: result.rows[0] });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
});

router.delete('/clear/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
    
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router;
