const pool = require('../config/db');

async function listCertifications(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, description, image_url, display_order FROM certifications ORDER BY display_order ASC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

function validate(body) {
  const { title, description, image_url } = body || {};
  if (!title || !description || !image_url) return 'title, description and image_url are required';
  return null;
}

async function createCertification(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { title, description, image_url, display_order } = req.body;
    const [result] = await pool.query(
      'INSERT INTO certifications (title, description, image_url, display_order) VALUES (?, ?, ?, ?)',
      [title, description, image_url, display_order || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
}

async function updateCertification(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { title, description, image_url, display_order } = req.body;
    await pool.query(
      'UPDATE certifications SET title = ?, description = ?, image_url = ?, display_order = ? WHERE id = ?',
      [title, description, image_url, display_order || 0, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function removeCertification(req, res, next) {
  try {
    await pool.query('DELETE FROM certifications WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listCertifications, createCertification, updateCertification, removeCertification };
