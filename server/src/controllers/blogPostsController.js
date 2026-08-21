const pool = require('../config/db');

// Aliased to camelCase -- these feed the public BlogList/BlogPost pages
// directly as plain JS objects, matching the convention used for other
// public reads (e.g. jobsController's employment_type AS employmentType).
const PUBLIC_LIST_FIELDS = `
  bp.id, bp.slug, bp.title, bp.excerpt,
  bp.cover_image_url AS coverImageUrl, bp.published_at AS publishedAt,
  bc.id AS categoryId, bc.name AS categoryName, bc.slug AS categorySlug
`;

const PUBLIC_DETAIL_FIELDS = `
  ${PUBLIC_LIST_FIELDS}, bp.content,
  bp.meta_title AS metaTitle, bp.meta_description AS metaDescription
`;

const ADMIN_FIELDS = `
  bp.id, bp.category_id, bp.slug, bp.title, bp.excerpt, bp.cover_image_url,
  bp.content, bp.status, bp.meta_title, bp.meta_description, bp.published_at,
  bp.created_at, bp.updated_at, bc.name AS category_name
`;

async function listPublishedPosts(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT ${PUBLIC_LIST_FIELDS} FROM blog_posts bp
       JOIN blog_categories bc ON bc.id = bp.category_id
       WHERE bp.status = 'published'
       ORDER BY bp.published_at DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getPublishedPostBySlug(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT ${PUBLIC_DETAIL_FIELDS} FROM blog_posts bp
       JOIN blog_categories bc ON bc.id = bp.category_id
       WHERE bp.slug = ? AND bp.status = 'published'
       LIMIT 1`,
      [req.params.slug]
    );
    // Drafts (and unknown slugs) 404 here, not just get omitted from the
    // list -- a draft's URL must not be reachable even if someone has it.
    if (!rows[0]) return res.status(404).json({ error: 'Post not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function listAllPosts(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT ${ADMIN_FIELDS} FROM blog_posts bp
       JOIN blog_categories bc ON bc.id = bp.category_id
       ORDER BY bp.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

function validate(body) {
  const { category_id, slug, title, content } = body || {};
  if (!category_id || !slug || !title || !content) {
    return 'category_id, slug, title and content are required';
  }
  return null;
}

async function createPost(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const {
      category_id, slug, title, excerpt, cover_image_url, content,
      status, meta_title, meta_description
    } = req.body;
    const finalStatus = status === 'published' ? 'published' : 'draft';
    const publishedAt = finalStatus === 'published' ? new Date() : null;

    const [result] = await pool.query(
      `INSERT INTO blog_posts
        (category_id, slug, title, excerpt, cover_image_url, content, status, meta_title, meta_description, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [category_id, slug, title, excerpt || null, cover_image_url || null, content, finalStatus, meta_title || null, meta_description || null, publishedAt]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'A post with this slug already exists' });
    if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
      return res.status(400).json({ error: 'category_id does not refer to an existing category' });
    }
    next(err);
  }
}

async function updatePost(req, res, next) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const {
      category_id, slug, title, excerpt, cover_image_url, content,
      status, meta_title, meta_description
    } = req.body;
    const finalStatus = status === 'published' ? 'published' : 'draft';

    // Only stamp published_at the first time a post goes live -- an admin
    // editing an already-published post shouldn't bump its publish date
    // back to "now" on every save.
    const [existingRows] = await pool.query(
      'SELECT published_at FROM blog_posts WHERE id = ?',
      [req.params.id]
    );
    if (!existingRows[0]) return res.status(404).json({ error: 'Post not found' });
    const publishedAt = finalStatus === 'published'
      ? (existingRows[0].published_at || new Date())
      : existingRows[0].published_at;

    await pool.query(
      `UPDATE blog_posts SET
        category_id = ?, slug = ?, title = ?, excerpt = ?, cover_image_url = ?,
        content = ?, status = ?, meta_title = ?, meta_description = ?, published_at = ?
       WHERE id = ?`,
      [category_id, slug, title, excerpt || null, cover_image_url || null, content, finalStatus, meta_title || null, meta_description || null, publishedAt, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'A post with this slug already exists' });
    if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
      return res.status(400).json({ error: 'category_id does not refer to an existing category' });
    }
    next(err);
  }
}

async function removePost(req, res, next) {
  try {
    await pool.query('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listPublishedPosts,
  getPublishedPostBySlug,
  listAllPosts,
  createPost,
  updatePost,
  removePost
};
