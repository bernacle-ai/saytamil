import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: true }
    : { rejectUnauthorized: false },
});

export default pool;

export async function initDB() {
  // Users table
  await pool.query(`
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
  `);

  // Usage limits table - tracks daily API usage per user
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usage (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      date DATE DEFAULT CURRENT_DATE,
      analysis_count INTEGER DEFAULT 0,
      UNIQUE(user_id, date)
    );
  `);

  // Chats table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS chats (
      id VARCHAR(100) PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) DEFAULT 'Untitled Chat',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Messages table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id VARCHAR(100) PRIMARY KEY,
      chat_id VARCHAR(100) REFERENCES chats(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      sender VARCHAR(20) NOT NULL,
      text TEXT NOT NULL,
      is_loading BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // OTP store
  await pool.query(`
    CREATE TABLE IF NOT EXISTS otp_store (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      otp VARCHAR(6) NOT NULL,
      type VARCHAR(20) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

// Keep backward compat
export const createUsersTable = initDB;

// Free plan limits
export const FREE_MONTHLY_LIMIT = 20;

export async function getUserUsageThisMonth(userId: number): Promise<number> {
  const result = await pool.query(
    `SELECT SUM(analysis_count) as total FROM usage 
     WHERE user_id = $1 
     AND date_trunc('month', date) = date_trunc('month', CURRENT_DATE)`,
    [userId]
  );
  return parseInt(result.rows[0]?.total || '0', 10);
}

export async function incrementUserUsage(userId: number): Promise<number> {
  await pool.query(
    `INSERT INTO usage (user_id, date, analysis_count)
     VALUES ($1, CURRENT_DATE, 1)
     ON CONFLICT (user_id, date)
     DO UPDATE SET analysis_count = usage.analysis_count + 1`,
    [userId]
  );
  return getUserUsageThisMonth(userId);
}

export async function getUserByEmail(email: string) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}
