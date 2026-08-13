const pool = require('../config/db');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STATUSES = ['new', 'contacted', 'closed'];

async function createEnquiry(req, res, next) {
  try {
    const { name, clinic, email, phone, subject, message } = req.body || {};

    const errors = [];
    if (!name || !String(name).trim()) errors.push('name is required');
    if (!email || !EMAIL_RE.test(String(email).trim())) errors.push('a valid email is required');
    if (!phone || !String(phone).trim()) errors.push('phone is required');
    if (!message || !String(message).trim()) errors.push('message is required');
    if (errors.length) {
      return res.status(400).json({ error: errors.join(', ') });
    }

    const [result] = await pool.query(
      `INSERT INTO enquiries (name, clinic, email, phone, subject, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        String(name).trim(),
        clinic ? String(clinic).trim() : null,
        String(email).trim(),
        String(phone).trim(),
        subject ? String(subject).trim() : 'General Enquiry',
        String(message).trim()
      ]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
}

// Shared by listEnquiries and exportEnquiriesCsv so search/status/date
// filtering behaves identically for the paged view and the CSV export.
function buildFilters(query) {
  const where = [];
  const params = [];

  const search = query.search && String(query.search).trim();
  if (search) {
    where.push('(name LIKE ? OR clinic LIKE ? OR email LIKE ? OR phone LIKE ? OR subject LIKE ? OR message LIKE ?)');
    const like = `%${search}%`;
    params.push(like, like, like, like, like, like);
  }

  const status = query.status && String(query.status).trim();
  if (status && STATUSES.includes(status)) {
    where.push('status = ?');
    params.push(status);
  }

  const from = query.from && String(query.from).trim();
  if (from) {
    where.push('created_at >= ?');
    params.push(`${from} 00:00:00`);
  }

  const to = query.to && String(query.to).trim();
  if (to) {
    where.push('created_at <= ?');
    params.push(`${to} 23:59:59`);
  }

  return { whereSql: where.length ? `WHERE ${where.join(' AND ')}` : '', params };
}

async function listEnquiries(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 25));
    const offset = (page - 1) * limit;
    const { whereSql, params } = buildFilters(req.query);

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM enquiries ${whereSql}`, params);
    const [rows] = await pool.query(
      `SELECT id, name, clinic, email, phone, subject, message, status, created_at AS createdAt
       FROM enquiries ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({ data: rows, page, limit, total });
  } catch (err) {
    next(err);
  }
}

function csvEscape(value) {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

async function exportEnquiriesCsv(req, res, next) {
  try {
    const { whereSql, params } = buildFilters(req.query);
    const [rows] = await pool.query(
      `SELECT name, clinic, email, phone, subject, message, status, created_at AS createdAt
       FROM enquiries ${whereSql} ORDER BY created_at DESC`,
      params
    );

    const header = ['Date', 'Name', 'Clinic', 'Email', 'Phone', 'Subject', 'Message', 'Status'];
    const lines = [header.join(',')];
    for (const row of rows) {
      lines.push([
        new Date(row.createdAt).toISOString(),
        row.name, row.clinic, row.email, row.phone, row.subject, row.message, row.status
      ].map(csvEscape).join(','));
    }

    res.set('Content-Disposition', `attachment; filename="denco-enquiries-${Date.now()}.csv"`);
    res.set('Content-Type', 'text/csv');
    res.send(lines.join('\n'));
  } catch (err) {
    next(err);
  }
}

async function updateEnquiryStatus(req, res, next) {
  try {
    const { status } = req.body || {};
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${STATUSES.join(', ')}` });
    }
    await pool.query('UPDATE enquiries SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function deleteEnquiry(req, res, next) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM enquiries WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { createEnquiry, listEnquiries, exportEnquiriesCsv, updateEnquiryStatus, deleteEnquiry };
