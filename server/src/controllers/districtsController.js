const pool = require('../config/db');

// Coverage status is computed live from office_districts — never stored —
// so adding/removing an office's districts immediately changes the result
// here with no separate "sync" step required.
async function listDistricts(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT d.id, d.name, d.slug, d.left_pct AS leftPct, d.top_pct AS topPct,
              CASE WHEN COUNT(od.office_id) > 0 THEN 'live' ELSE 'soon' END AS status
       FROM districts d
       LEFT JOIN office_districts od ON od.district_id = d.id
       GROUP BY d.id, d.name, d.slug, d.left_pct, d.top_pct, d.display_order
       ORDER BY d.display_order ASC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { listDistricts };
