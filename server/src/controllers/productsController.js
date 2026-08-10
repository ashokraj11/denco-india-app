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

module.exports = { listProducts };
