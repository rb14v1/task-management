import 'dotenv/config';
import { pool, runMigrations } from './db.js';
import { hashPassword } from './auth.js';

async function main() {
  const username = process.env.SEED_USERNAME;
  const password = process.env.SEED_PASSWORD;

  if (!username || !password) {
    console.error('[seed] SEED_USERNAME and SEED_PASSWORD must be set in the environment.');
    process.exit(1);
  }

  await runMigrations();

  const passwordHash = await hashPassword(password);
  await pool.query(
    `INSERT INTO users (username, password_hash) VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [username, passwordHash]
  );

  console.log(`[seed] User "${username}" is ready.`);
  await pool.end();
}

main().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
