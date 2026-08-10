const pool = require('../config/db');

async function listStats(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, icon_key, label FROM stats ORDER BY display_order ASC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { listStats };
