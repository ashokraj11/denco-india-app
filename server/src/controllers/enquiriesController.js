const pool = require('../config/db');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

async function listEnquiries(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 25));
    const offset = (page - 1) * limit;

    const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM enquiries');
    const [rows] = await pool.query(
      `SELECT id, name, clinic, email, phone, subject, message, status, created_at AS createdAt
       FROM enquiries ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    res.json({ data: rows, page, limit, total });
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

module.exports = { createEnquiry, listEnquiries, deleteEnquiry };
