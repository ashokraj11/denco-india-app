const pool = require('../config/db');

async function listServices(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, icon_key, category_slug FROM services ORDER BY display_order ASC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { listServices };
