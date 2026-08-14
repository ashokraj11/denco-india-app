const pool = require('../config/db');

async function listTrustBadges(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, image_url AS imageUrl, display_order FROM trust_badges ORDER BY display_order ASC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function createTrustBadge(req, res, next) {
  try {
    const { image_url, display_order } = req.body || {};
    if (!image_url) return res.status(400).json({ error: 'image_url is required' });
    const [result] = await pool.query(
      'INSERT INTO trust_badges (image_url, display_order) VALUES (?, ?)',
      [image_url, display_order || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
}

async function updateTrustBadge(req, res, next) {
  try {
    const { image_url, display_order } = req.body || {};
    if (!image_url) return res.status(400).json({ error: 'image_url is required' });
    await pool.query(
      'UPDATE trust_badges SET image_url = ?, display_order = ? WHERE id = ?',
      [image_url, display_order || 0, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function removeTrustBadge(req, res, next) {
  try {
    await pool.query('DELETE FROM trust_badges WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listTrustBadges, createTrustBadge, updateTrustBadge, removeTrustBadge };
