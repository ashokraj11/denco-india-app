const pool = require('../config/db');

const CATEGORIES = ['ordering', 'digital', 'quality', 'logistics', 'billing'];

async function listFaqs(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, category, question, answer_html AS answerHtml, display_order FROM faqs ORDER BY display_order ASC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

function validate(body) {
  const { category, question, answer_html } = body || {};
  if (!category || !question || !answer_html) return 'category, question and answer_html are required';
  if (!CATEGORIES.includes(category)) return `category must be one of: ${CATEGORIES.join(', ')}`;
  return null;
}

async function createFaq(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { category, question, answer_html, display_order } = req.body;
    const [result] = await pool.query(
      'INSERT INTO faqs (category, question, answer_html, display_order) VALUES (?, ?, ?, ?)',
      [category, question, answer_html, display_order || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
}

async function updateFaq(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { category, question, answer_html, display_order } = req.body;
    await pool.query(
      'UPDATE faqs SET category = ?, question = ?, answer_html = ?, display_order = ? WHERE id = ?',
      [category, question, answer_html, display_order || 0, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function removeFaq(req, res, next) {
  try {
    await pool.query('DELETE FROM faqs WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listFaqs, createFaq, updateFaq, removeFaq };
