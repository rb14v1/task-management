// Production server: Express app serving the API and the built frontend.
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cookieParser from 'cookie-parser';
import { runMigrations } from './server/db.js';
import authRoutes from './server/routes/auth.js';
import taskRoutes from './server/routes/tasks.js';

const REQUIRED_ENV_VARS = ['DATABASE_URL', 'JWT_SECRET'];
const missingVars = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);
if (missingVars.length > 0) {
  console.error(
    `[startup] Missing required environment variables: ${missingVars.join(', ')}.\n` +
    'Copy .env.example to .env and fill in all values before starting the server.'
  );
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get(['/healthz', '/health'], (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(express.static(DIST_DIR));

// SPA fallback for client-side routing — anything that isn't an API call
// falls through to index.html.
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

runMigrations()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[startup] Failed to run migrations:', err);
    process.exit(1);
  });
