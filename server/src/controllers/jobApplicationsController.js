const fs = require('fs');
const path = require('path');
const pool = require('../config/db');
const { resumeDir } = require('../middleware/upload');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STATUSES = ['new', 'reviewed', 'shortlisted', 'rejected'];

async function createApplication(req, res, next) {
  try {
    const { name, email, phone, message, job_id } = req.body || {};

    const errors = [];
    if (!name || !String(name).trim()) errors.push('name is required');
    if (!email || !EMAIL_RE.test(String(email).trim())) errors.push('a valid email is required');
    if (!phone || !String(phone).trim()) errors.push('phone is required');
    if (!req.file) errors.push('a resume file is required');
    if (errors.length) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(400).json({ error: errors.join(', ') });
    }

    const jobId = job_id && String(job_id).trim() ? Number(job_id) : null;

    const [result] = await pool.query(
      `INSERT INTO job_applications (job_id, name, email, phone, message, resume_path, resume_filename)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        jobId,
        String(name).trim(),
        String(email).trim(),
        String(phone).trim(),
        message ? String(message).trim() : null,
        req.file.filename,
        req.file.originalname
      ]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(err);
  }
}

async function listApplications(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.job_id AS jobId, j.title AS jobTitle, a.name, a.email, a.phone, a.message,
              a.resume_filename AS resumeFilename, a.status, a.created_at AS createdAt
       FROM job_applications a LEFT JOIN job_openings j ON j.id = a.job_id
       ORDER BY a.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function updateApplicationStatus(req, res, next) {
  try {
    const { status } = req.body || {};
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${STATUSES.join(', ')}` });
    }
    await pool.query('UPDATE job_applications SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function deleteApplication(req, res, next) {
  try {
    const [[row]] = await pool.query('SELECT resume_path FROM job_applications WHERE id = ?', [req.params.id]);
    await pool.query('DELETE FROM job_applications WHERE id = ?', [req.params.id]);
    if (row) fs.unlink(path.join(resumeDir, row.resume_path), () => {});
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function downloadResume(req, res, next) {
  try {
    const [[row]] = await pool.query(
      'SELECT resume_path, resume_filename FROM job_applications WHERE id = ?',
      [req.params.id]
    );
    if (!row) return res.status(404).json({ error: 'Application not found' });

    const filePath = path.join(resumeDir, row.resume_path);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Resume file not found' });

    res.download(filePath, row.resume_filename);
  } catch (err) {
    next(err);
  }
}

module.exports = { createApplication, listApplications, updateApplicationStatus, deleteApplication, downloadResume };
