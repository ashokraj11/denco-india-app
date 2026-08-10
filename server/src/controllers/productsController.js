const pool = require('../config/db');

async function listProducts(req, res, next) {
  try {
    const [categories] = await pool.query(
      'SELECT id, slug, name, icon_key FROM product_categories ORDER BY display_order ASC'
    );
    const [products] = await pool.query(
      'SELECT id, category_id, name, image_url, description FROM products ORDER BY display_order ASC'
    );

    const result = categories.map((cat) => ({
      ...cat,
      products: products.filter((p) => p.category_id === cat.id)
        .map(({ category_id, ...rest }) => rest)
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const { category_id, name, image_url, description, display_order } = req.body || {};
    if (!category_id || !name || !image_url || !description) {
      return res.status(400).json({ error: 'category_id, name, image_url and description are required' });
    }
    const [result] = await pool.query(
      'INSERT INTO products (category_id, name, image_url, description, display_order) VALUES (?, ?, ?, ?, ?)',
      [category_id, name, image_url, description, display_order || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { category_id, name, image_url, description, display_order } = req.body || {};
    if (!category_id || !name || !image_url || !description) {
      return res.status(400).json({ error: 'category_id, name, image_url and description are required' });
    }
    await pool.query(
      'UPDATE products SET category_id = ?, name = ?, image_url = ?, description = ?, display_order = ? WHERE id = ?',
      [category_id, name, image_url, description, display_order || 0, id]
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function removeProduct(req, res, next) {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listProducts, createProduct, updateProduct, removeProduct };
