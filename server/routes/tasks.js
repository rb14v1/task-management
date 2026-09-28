import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../auth.js';

const router = Router();
router.use(requireAuth);

function toTodo(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    status: row.status,
    priority: row.priority,
    tags: row.tags ?? [],
    dueDate: row.due_date ? new Date(row.due_date).toISOString() : undefined,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

router.get('/', async (_req, res) => {
  const { rows } = await query('SELECT * FROM tasks ORDER BY created_at DESC');
  res.json(rows.map(toTodo));
});

router.get('/:id', async (req, res) => {
  const { rows } = await query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Task not found' });
  res.json(toTodo(rows[0]));
});

router.post('/', async (req, res) => {
  const { title, description, status, priority, tags, dueDate } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const { rows } = await query(
    `INSERT INTO tasks (title, description, status, priority, tags, due_date)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, description ?? null, status ?? 'todo', priority ?? 'medium', tags ?? [], dueDate || null]
  );
  res.status(201).json(toTodo(rows[0]));
});

router.put('/:id', async (req, res) => {
  const existing = await query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
  if (!existing.rows[0]) return res.status(404).json({ error: 'Task not found' });

  const current = existing.rows[0];
  const body = req.body || {};
  const merged = {
    title: body.title ?? current.title,
    description: body.description !== undefined ? body.description : current.description,
    status: body.status ?? current.status,
    priority: body.priority ?? current.priority,
    tags: body.tags ?? current.tags,
    due_date: body.dueDate !== undefined ? (body.dueDate || null) : current.due_date,
  };

  const { rows } = await query(
    `UPDATE tasks SET title=$1, description=$2, status=$3, priority=$4, tags=$5, due_date=$6, updated_at=now()
     WHERE id=$7 RETURNING *`,
    [merged.title, merged.description, merged.status, merged.priority, merged.tags, merged.due_date, req.params.id]
  );
  res.json(toTodo(rows[0]));
});

router.delete('/:id', async (req, res) => {
  await query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
  res.status(204).end();
});

export default router;
