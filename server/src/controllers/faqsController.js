const pool = require('../config/db');

async function listFaqs(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, category, question, answer_html AS answerHtml FROM faqs ORDER BY display_order ASC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { listFaqs };
