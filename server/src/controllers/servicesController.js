const pool = require('../config/db');

const ICON_KEYS = ['crown', 'cadcam', 'zirconia', 'implant', 'denture', 'scan'];

async function listServices(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, icon_key, category_slug, display_order FROM services ORDER BY display_order ASC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

function validate(body) {
  const { title, icon_key, category_slug } = body || {};
  if (!title || !icon_key || !category_slug) return 'title, icon_key and category_slug are required';
  if (!ICON_KEYS.includes(icon_key)) return `icon_key must be one of: ${ICON_KEYS.join(', ')}`;
  return null;
}

async function createService(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { title, icon_key, category_slug, display_order } = req.body;
    const [result] = await pool.query(
      'INSERT INTO services (title, icon_key, category_slug, display_order) VALUES (?, ?, ?, ?)',
      [title, icon_key, category_slug, display_order || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
}

async function updateService(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { title, icon_key, category_slug, display_order } = req.body;
    await pool.query(
      'UPDATE services SET title = ?, icon_key = ?, category_slug = ?, display_order = ? WHERE id = ?',
      [title, icon_key, category_slug, display_order || 0, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function removeService(req, res, next) {
  try {
    await pool.query('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listServices, createService, updateService, removeService };
