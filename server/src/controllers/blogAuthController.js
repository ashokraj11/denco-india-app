const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

async function login(req, res, next) {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' });
    }

    const [rows] = await pool.query(
      'SELECT id, username, password_hash FROM blog_users WHERE username = ? LIMIT 1',
      [String(username).trim()]
    );
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { sub: user.id, username: user.username, scope: 'blog' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '12h' }
    );

    res.json({ token, username: user.username });
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
