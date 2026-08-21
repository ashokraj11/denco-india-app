const jwt = require('jsonwebtoken');

// Mirrors requireAdmin, but only accepts tokens issued by blogAuthController
// (scope: 'blog') -- keeps the blog portal's sessions from working against
// /api/admin/* and vice versa, even though both are signed with the same
// JWT_SECRET. See requireAdmin's matching scope check in auth.js.
function requireBlogAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed authorization header' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.scope !== 'blog') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.blogAdmin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { requireBlogAdmin };
