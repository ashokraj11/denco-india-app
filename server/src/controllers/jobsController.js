const pool = require('../config/db');

async function listJobs(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, location, employment_type AS employmentType, description, display_order,
              created_at AS datePosted
       FROM job_openings WHERE is_active = 1 ORDER BY display_order ASC, id DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// Unaliased snake_case columns here (unlike listJobs above) so this response
// can be spread directly into AdminCrudTable's edit form, whose field names
// match the DB columns (see client/src/pages/admin/AdminJobs.jsx). is_active
// is normalized to the 'active'/'inactive' strings the edit form's <select>
// uses, since MySQL's 0 would otherwise round-trip as a falsy value AdminCrudTable's
// generic select input can't tell apart from "nothing selected".
async function listAllJobs(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, location, employment_type, description,
              is_active, display_order, created_at
       FROM job_openings ORDER BY display_order ASC, id DESC`
    );
    res.json(rows.map((row) => ({ ...row, is_active: row.is_active ? 'active' : 'inactive' })));
  } catch (err) {
    next(err);
  }
}

// Admin form submits is_active as the select's string value ('active' /
// 'inactive' -- see AdminJobs.jsx), not a real boolean.
function isActiveValue(is_active) {
  return is_active === 'inactive' || is_active === false || is_active === 0 ? 0 : 1;
}

function validate(body) {
  const { title } = body || {};
  if (!title || !String(title).trim()) return 'title is required';
  return null;
}

async function createJob(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { title, location, employment_type, description, is_active, display_order } = req.body;
    const [result] = await pool.query(
      `INSERT INTO job_openings (title, location, employment_type, description, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        String(title).trim(),
        location ? String(location).trim() : null,
        employment_type ? String(employment_type).trim() : 'Full-time',
        description ? String(description).trim() : null,
        isActiveValue(is_active),
        display_order || 0
      ]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
}

async function updateJob(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { title, location, employment_type, description, is_active, display_order } = req.body;
    await pool.query(
      `UPDATE job_openings SET title = ?, location = ?, employment_type = ?, description = ?,
              is_active = ?, display_order = ? WHERE id = ?`,
      [
        String(title).trim(),
        location ? String(location).trim() : null,
        employment_type ? String(employment_type).trim() : 'Full-time',
        description ? String(description).trim() : null,
        isActiveValue(is_active),
        display_order || 0,
        req.params.id
      ]
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function removeJob(req, res, next) {
  try {
    await pool.query('DELETE FROM job_openings WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listJobs, listAllJobs, createJob, updateJob, removeJob };
