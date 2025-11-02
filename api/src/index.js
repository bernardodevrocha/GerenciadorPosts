import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/posts', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, title, body FROM posts ORDER BY id ASC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [[row]] = await pool.query(
      `SELECT p.id, p.title, p.body,
              (SELECT url FROM photos WHERE post_id = p.id ORDER BY id ASC LIMIT 1) AS cover
       FROM posts p WHERE p.id = ?`,
      [id],
    );
    if (!row) return res.status(404).json({ error: 'Post não encontrado' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/posts', async (req, res) => {
  const { title, body, cover } = req.body ?? {};
  if (typeof title !== 'string' || typeof body !== 'string') {
    return res.status(400).json({
      error: 'title e body são obrigatórios (envie JSON ou x-www-form-urlencoded)',
    });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [r] = await conn.query('INSERT INTO posts (title, body) VALUES (?, ?)', [title, body]);
    const postId = r.insertId;
    if (cover) await conn.query('INSERT INTO photos (post_id, url) VALUES (?, ?)', [postId, cover]);
    await conn.commit();
    res.status(201).json({ id: postId, title, body, cover: cover ?? null });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ error: e.message });
  } finally {
    conn.release();
  }
});

app.put('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { title = null, body = null, cover } = req.body || {};

  const conn = await pool.getConnection();
  try {
    const [exists] = await conn.query('SELECT id FROM posts WHERE id=?', [id]);
    if (!exists.length) {
      conn.release();
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    await conn.beginTransaction();
    await conn.query('UPDATE posts SET title = COALESCE(?, title), body = COALESCE(?, body) WHERE id = ?', [
      title,
      body,
      id,
    ]);

    // cover: string => upsert, null => remove, undefined => ignora
    if (cover !== undefined) {
      if (cover === null) {
        await conn.query('DELETE FROM photos WHERE post_id = ?', [id]);
      } else {
        const [up] = await conn.query('UPDATE photos SET url=? WHERE post_id=?', [cover, id]);
        if (up.affectedRows === 0) {
          await conn.query('INSERT INTO photos (post_id, url) VALUES (?, ?)', [id, cover]);
        }
      }
    }

    await conn.commit();

    const [[row]] = await pool.query(
      `SELECT p.id, p.title, p.body,
              (SELECT url FROM photos WHERE post_id = p.id ORDER BY id ASC LIMIT 1) AS cover
       FROM posts p WHERE p.id = ?`,
      [id],
    );
    res.json(row);
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ error: e.message });
  } finally {
    conn.release();
  }
});

// DELETAR (fotos saem por ON DELETE CASCADE)
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const [r] = await pool.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Post não encontrado' });
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// eslint-disable-next-line no-undef
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API http://localhost:${port}`));
