import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function clearProducts() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('🗑️  Clearing products table...');
    
    await client.query('DELETE FROM products');
    
    await client.query('COMMIT');
    console.log('✅ Products table cleared successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error clearing products:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

clearProducts();