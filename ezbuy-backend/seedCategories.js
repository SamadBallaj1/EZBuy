import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const categories = [
  { id: 1, name: 'Electronics', slug: 'electronics', description: 'Laptops, tablets, monitors, and tech essentials' },
  { id: 2, name: 'Accessories', slug: 'accessories', description: 'Mice, keyboards, cables, and desk accessories' },
  { id: 3, name: 'Audio', slug: 'audio', description: 'Headphones, earbuds, speakers, and microphones' },
  { id: 4, name: 'Fashion', slug: 'fashion', description: 'Blue light glasses, hoodies, and bags' },
  { id: 5, name: 'Home & Kitchen', slug: 'home', description: 'Desk lamps, organizers, and home essentials' },
  { id: 6, name: 'Coffee & Drinks', slug: 'coffee', description: 'Mugs, kettles, and water bottles' },
  { id: 7, name: 'Student Essentials', slug: 'student', description: 'Notebooks, planners, and study tools' }
];

async function seedCategories() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('🗂️  Seeding categories...');
    
    for (const category of categories) {
      await client.query(`
        INSERT INTO categories (id, name, slug, description)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO UPDATE 
        SET name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description
      `, [category.id, category.name, category.slug, category.description]);
    }
    
    await client.query('COMMIT');
    console.log(`✅ Successfully seeded ${categories.length} categories!`);
    categories.forEach(cat => {
      console.log(`   - ${cat.name}`);
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding categories:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedCategories();