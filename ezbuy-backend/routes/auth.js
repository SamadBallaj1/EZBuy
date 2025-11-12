import express from 'express';
import { pool } from '../server.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, name, is_student } = req.body;
    
    if (is_student && !email.endsWith('.edu')) {
      return res.status(400).json({ error: 'Student email must end with .edu' });
    }
    
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const result = await pool.query(`
      INSERT INTO users (email, name, is_student)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [email, name, is_student]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

router.post('/github', async (req, res) => {
  try {
    const { github_id, email, name } = req.body;
    
    let result = await pool.query('SELECT * FROM users WHERE github_id = $1', [github_id]);
    
    if (result.rows.length === 0) {
      result = await pool.query(`
        INSERT INTO users (email, name, github_id, is_student)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [email, name, github_id, email.endsWith('.edu')]);
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error with GitHub auth:', error);
    res.status(500).json({ error: 'Failed to authenticate with GitHub' });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.patch('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, is_student } = req.body;
    
    const result = await pool.query(`
      UPDATE users 
      SET name = COALESCE($1, name),
          is_student = COALESCE($2, is_student)
      WHERE id = $3
      RETURNING *
    `, [name, is_student, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;
