const pool = require('../config/db');

async function listTestimonials(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, role, quote, media_type AS mediaType, media_url AS mediaUrl, display_order
       FROM testimonials ORDER BY display_order ASC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

function validate(body) {
  const { name, media_type } = body || {};
  if (!name || !String(name).trim()) return 'name is required';
  if (media_type && !['image', 'video'].includes(media_type)) return 'media_type must be "image" or "video"';
  return null;
}

async function createTestimonial(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { name, role, quote, media_type, media_url, display_order } = req.body;
    const [result] = await pool.query(
      'INSERT INTO testimonials (name, role, quote, media_type, media_url, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [name, role || null, quote || null, media_type || 'image', media_url || null, display_order || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
}

async function updateTestimonial(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { name, role, quote, media_type, media_url, display_order } = req.body;
    await pool.query(
      'UPDATE testimonials SET name = ?, role = ?, quote = ?, media_type = ?, media_url = ?, display_order = ? WHERE id = ?',
      [name, role || null, quote || null, media_type || 'image', media_url || null, display_order || 0, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function removeTestimonial(req, res, next) {
  try {
    await pool.query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listTestimonials, createTestimonial, updateTestimonial, removeTestimonial };
