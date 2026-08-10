const pool = require('../config/db');

async function listCertifications(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, description, image_url FROM certifications ORDER BY display_order ASC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { listCertifications };
