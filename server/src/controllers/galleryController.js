const pool = require('../config/db');

async function listGallery(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, media_type AS mediaType, media_url AS mediaUrl, display_order FROM gallery_items ORDER BY display_order ASC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

function validate(body) {
  const { title, media_type, media_url } = body || {};
  if (!title || !media_url) return 'title and media_url are required';
  if (media_type && !['image', 'video'].includes(media_type)) return 'media_type must be "image" or "video"';
  return null;
}

async function createGalleryItem(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { title, media_type, media_url, display_order } = req.body;
    const [result] = await pool.query(
      'INSERT INTO gallery_items (title, media_type, media_url, display_order) VALUES (?, ?, ?, ?)',
      [title, media_type || 'image', media_url, display_order || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
}

async function updateGalleryItem(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { title, media_type, media_url, display_order } = req.body;
    await pool.query(
      'UPDATE gallery_items SET title = ?, media_type = ?, media_url = ?, display_order = ? WHERE id = ?',
      [title, media_type || 'image', media_url, display_order || 0, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function removeGalleryItem(req, res, next) {
  try {
    await pool.query('DELETE FROM gallery_items WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listGallery, createGalleryItem, updateGalleryItem, removeGalleryItem };
