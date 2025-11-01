import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
app.use(cors());

app.get('/api/posts', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, title, body FROM posts ORDER BY id ASC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/photos', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, post_id, url FROM photos ORDER BY post_id ASC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/posts', async (req, res) => {
  const { title, body, cover } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title e body são obrigatórios' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query('INSERT INTO posts (title, body) VALUES (?, ?)', [title, body]);
    const postId = result.insertId;

    if (cover) {
      await conn.query('INSERT INTO photos (post_id, url) VALUES (?, ?)', [postId, cover]);
    }

    await conn.commit();
    res.status(201).json({ id: postId, title, body, cover: cover ?? null });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ error: e.message });
  } finally {
    conn.release();
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [[row]] = await pool.query(
      `SELECT
         p.id,
         p.title,
         p.body,
         (SELECT url FROM photos WHERE post_id = p.id ORDER BY id ASC LIMIT 1) AS cover
       FROM posts p
       WHERE p.id = ?`,
      [id],
    );

    if (!row) return res.status(404).json({ error: 'Post não encontrado' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/posts/:id/photos', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT id, url FROM photos WHERE post_id = ? ORDER BY id ASC', [id]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API em http://localhost:${port}`));
