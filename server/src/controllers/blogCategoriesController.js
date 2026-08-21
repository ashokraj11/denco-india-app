const pool = require('../config/db');

async function listCategories(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, slug, name, display_order FROM blog_categories ORDER BY display_order ASC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

function validate(body) {
  const { slug, name } = body || {};
  if (!slug || !name) return 'slug and name are required';
  return null;
}

async function createCategory(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { slug, name, display_order } = req.body;
    const [result] = await pool.query(
      'INSERT INTO blog_categories (slug, name, display_order) VALUES (?, ?, ?)',
      [slug, name, display_order || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'A category with this slug already exists' });
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { slug, name, display_order } = req.body;
    await pool.query(
      'UPDATE blog_categories SET slug = ?, name = ?, display_order = ? WHERE id = ?',
      [slug, name, display_order || 0, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'A category with this slug already exists' });
    next(err);
  }
}

async function removeCategory(req, res, next) {
  try {
    // blog_posts.category_id is ON DELETE RESTRICT -- unlike product
    // categories, a category with posts must be explicitly reassigned or
    // emptied first rather than silently cascading the delete to them.
    const [[{ count }]] = await pool.query(
      'SELECT COUNT(*) AS count FROM blog_posts WHERE category_id = ?',
      [req.params.id]
    );
    if (count > 0) {
      return res.status(409).json({ error: 'This category has posts — reassign or delete them first' });
    }
    await pool.query('DELETE FROM blog_categories WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listCategories, createCategory, updateCategory, removeCategory };
