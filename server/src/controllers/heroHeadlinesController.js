const pool = require('../config/db');

async function listHeroHeadlines(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, line1, line2, accent, display_order FROM hero_headlines ORDER BY display_order ASC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

function validate(body) {
  const { line1, line2, accent } = body || {};
  if (!line1 || !line2 || !accent) return 'line1, line2 and accent are required';
  return null;
}

async function createHeroHeadline(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { line1, line2, accent, display_order } = req.body;
    const [result] = await pool.query(
      'INSERT INTO hero_headlines (line1, line2, accent, display_order) VALUES (?, ?, ?, ?)',
      [line1, line2, accent, display_order || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
}

async function updateHeroHeadline(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { line1, line2, accent, display_order } = req.body;
    await pool.query(
      'UPDATE hero_headlines SET line1 = ?, line2 = ?, accent = ?, display_order = ? WHERE id = ?',
      [line1, line2, accent, display_order || 0, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function removeHeroHeadline(req, res, next) {
  try {
    await pool.query('DELETE FROM hero_headlines WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listHeroHeadlines, createHeroHeadline, updateHeroHeadline, removeHeroHeadline };
