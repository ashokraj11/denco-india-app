const pool = require('../config/db');

const COLUMNS = [
  'site_name', 'tagline', 'logo_url', 'secondary_logo_url', 'brochure_url', 'testimonials_visible',
  'meta_title', 'meta_description', 'contact_phone', 'contact_email', 'contact_address', 'whatsapp_number'
];

async function getSettings(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT site_name AS siteName, tagline, logo_url AS logoUrl, secondary_logo_url AS secondaryLogoUrl,
              brochure_url AS brochureUrl, testimonials_visible AS testimonialsVisible,
              meta_title AS metaTitle, meta_description AS metaDescription,
              contact_phone AS contactPhone, contact_email AS contactEmail, contact_address AS contactAddress,
              whatsapp_number AS whatsappNumber
       FROM site_settings WHERE id = 1`
    );
    const row = rows[0];
    if (row) row.testimonialsVisible = !!row.testimonialsVisible;
    res.json(row || null);
  } catch (err) {
    next(err);
  }
}

async function updateSettings(req, res, next) {
  try {
    const updates = {};
    for (const col of COLUMNS) {
      if (req.body && Object.prototype.hasOwnProperty.call(req.body, col)) {
        updates[col] = req.body[col];
      }
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid settings fields provided' });
    }
    const setClause = Object.keys(updates).map((col) => `${col} = ?`).join(', ');
    await pool.query(`UPDATE site_settings SET ${setClause} WHERE id = 1`, Object.values(updates));
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSettings, updateSettings };
