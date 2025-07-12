const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'dreamteam_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...');

    // Read and execute schema migration
    const schemaPath = path.join(__dirname, '../src/migrations/001_initial_schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📊 Creating database schema...');
    await pool.query(schemaSQL);
    console.log('✅ Schema created successfully');

    // Read and execute seed data
    const seedPath = path.join(__dirname, '../src/migrations/002_seed_data.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    
    console.log('🌱 Seeding initial data...');
    await pool.query(seedSQL);
    console.log('✅ Seed data inserted successfully');

    console.log('🎉 Database migration completed successfully!');
    
    // Show summary
    const result = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM positions WHERE type = 'minister') as ministers,
        (SELECT COUNT(*) FROM positions WHERE type = 'committee') as committees,
        (SELECT COUNT(*) FROM quiz_questions) as questions
    `);
    
    console.log('\n📈 Database Summary:');
    console.log(`  • Minister positions: ${result.rows[0].ministers}`);
    console.log(`  • Committee positions: ${result.rows[0].committees}`);
    console.log(`  • Quiz questions: ${result.rows[0].questions}`);
    console.log('\n🔐 Security features initialized:');
    console.log('  • Encrypted user data storage');
    console.log('  • Real vs fake data obfuscation ready');
    console.log('  • Anonymous user tracking tables');
    console.log('  • Comprehensive indexing for performance');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };