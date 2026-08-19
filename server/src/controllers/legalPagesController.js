const pool = require('../config/db');

async function getAllPages(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT slug, title, content, updated_at AS updatedAt FROM legal_pages ORDER BY slug'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getPage(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT slug, title, content, updated_at AS updatedAt FROM legal_pages WHERE slug = ?',
      [req.params.slug]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Page not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updatePage(req, res, next) {
  try {
    const { title, content } = req.body;
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ error: 'title and content are required' });
    }
    const [result] = await pool.query(
      'UPDATE legal_pages SET title = ?, content = ? WHERE slug = ?',
      [title.trim(), content, req.params.slug]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Page not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllPages, getPage, updatePage };
