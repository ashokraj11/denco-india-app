const pool = require('../config/db');

// Keep in sync with client/src/constants/contentIcons.js and
// client/src/components/icons/ContentIcon.jsx.
const ICON_KEYS = [
  'crown', 'cadcam', 'zirconia', 'implant', 'denture', 'scan',
  'tooth', 'molar', 'toothbrush', 'floss', 'smile', 'xray', 'injection',
  'chair', 'magnifier', 'certificate', 'calendar', 'truck', 'package',
  'flask', 'printer', 'gear', 'heart', 'handshake', 'clinic', 'globe',
  'mappin', 'shield'
];

async function listCategories(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, slug, name, icon_key, display_order FROM product_categories ORDER BY display_order ASC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

function validate(body) {
  const { slug, name, icon_key } = body || {};
  if (!slug || !name || !icon_key) return 'slug, name and icon_key are required';
  if (!ICON_KEYS.includes(icon_key)) return `icon_key must be one of: ${ICON_KEYS.join(', ')}`;
  return null;
}

async function createCategory(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { slug, name, icon_key, display_order } = req.body;
    const [result] = await pool.query(
      'INSERT INTO product_categories (slug, name, icon_key, display_order) VALUES (?, ?, ?, ?)',
      [slug, name, icon_key, display_order || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'A category with this slug already exists' });
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { slug, name, icon_key, display_order } = req.body;
    await pool.query(
      'UPDATE product_categories SET slug = ?, name = ?, icon_key = ?, display_order = ? WHERE id = ?',
      [slug, name, icon_key, display_order || 0, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'A category with this slug already exists' });
    next(err);
  }
}

async function removeCategory(req, res, next) {
  try {
    // products.category_id has ON DELETE CASCADE, so this also removes its products.
    await pool.query('DELETE FROM product_categories WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listCategories, createCategory, updateCategory, removeCategory };
