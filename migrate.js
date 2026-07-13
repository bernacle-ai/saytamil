const { Pool } = require('pg');

const oldDbUrl = 'postgresql://neondb_owner:npg_Ri2lQ8fGKwnt@ep-red-poetry-a83x4mrt-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require';
const newDbUrl = 'postgresql://neondb_owner:npg_efqBAnJ9m5wS@ep-jolly-truth-aov8eucu-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const oldPool = new Pool({
  connectionString: oldDbUrl,
  ssl: { rejectUnauthorized: false },
});

const newPool = new Pool({
  connectionString: newDbUrl,
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  console.log('Starting migration...');
  
  // 1. Create tables on the new DB
  console.log('Creating tables on new DB...');
  await newPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      google_id VARCHAR(255),
      name VARCHAR(255),
      image VARCHAR(500),
      password_hash VARCHAR(255),
      plan VARCHAR(20) DEFAULT 'free',
      created_at TIMESTAMP DEFAULT NOW()
    );
    ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS image VARCHAR(500);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS plan VARCHAR(20) DEFAULT 'free';

    CREATE TABLE IF NOT EXISTS usage (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      date DATE DEFAULT CURRENT_DATE,
      analysis_count INTEGER DEFAULT 0,
      UNIQUE(user_id, date)
    );

    CREATE TABLE IF NOT EXISTS chats (
      id VARCHAR(100) PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) DEFAULT 'Untitled Chat',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS messages (
      id VARCHAR(100) PRIMARY KEY,
      chat_id VARCHAR(100) REFERENCES chats(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      sender VARCHAR(20) NOT NULL,
      text TEXT NOT NULL,
      is_loading BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS otp_store (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      otp VARCHAR(6) NOT NULL,
      type VARCHAR(20) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  
  // Migrate data
  const tables = ['users', 'usage', 'chats', 'messages', 'otp_store'];
  
  for (const table of tables) {
    console.log("Migrating table " + table + "...");
    const { rows } = await oldPool.query("SELECT * FROM " + table);
    if (rows.length === 0) {
      console.log("No data in " + table + ", skipping.");
      continue;
    }
    
    // Insert into new DB
    let inserted = 0;
    for (const row of rows) {
      const keys = Object.keys(row);
      const values = Object.values(row);
      
      const placeholders = keys.map((_, i) => "$" + (i + 1)).join(', ');
      const columns = keys.join(', ');
      
      try {
        await newPool.query("INSERT INTO " + table + " (" + columns + ") VALUES (" + placeholders + ") ON CONFLICT DO NOTHING", values);
        inserted++;
      } catch (err) {
        console.error("Error inserting into " + table + ":", err.message);
      }
    }
    console.log("Migrated " + inserted + " rows for " + table + ".");
    
    // Update sequence if the table has an auto-incrementing 'id'
    if (['users', 'usage', 'otp_store'].includes(table)) {
      try {
        const { rows: maxRows } = await newPool.query("SELECT MAX(id) as max_id FROM " + table);
        const maxId = maxRows[0].max_id;
        if (maxId) {
          await newPool.query("SELECT setval('" + table + "_id_seq', " + maxId + ")");
          console.log("Updated sequence for " + table + " to " + maxId);
        }
      } catch (e) {
         // ignore
      }
    }
  }

  console.log('Migration complete!');
  oldPool.end();
  newPool.end();
}

migrate().catch(err => {
  console.error(err);
  oldPool.end();
  newPool.end();
});
