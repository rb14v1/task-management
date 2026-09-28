import { Router } from 'express';
import { query } from '../db.js';
import { verifyPassword, signToken, setAuthCookie, clearAuthCookie, requireAuth } from '../auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const { rows } = await query(
    'SELECT id, username, password_hash FROM users WHERE username = $1',
    [username]
  );
  const user = rows[0];

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = signToken({ sub: user.id, username: user.username });
  setAuthCookie(res, token);
  res.json({ username: user.username });
});

router.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.status(204).end();
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ username: req.user.username });
});

export default router;
