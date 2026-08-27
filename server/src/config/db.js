const mysql = require('mysql2/promise');
require('./loadEnv');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'denco_india',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
  // Shared MySQL hosting typically force-closes a connection after a short
  // server-side wait_timeout. Without this, a pooled connection can go
  // stale during a quiet period and the pool doesn't notice until it hands
  // that dead socket to the NEXT query, which then fails outright -- often
  // every endpoint at once, since several pooled connections go stale
  // together. idleTimeout/maxIdle make the pool close and replace idle
  // connections itself before MySQL does it out from under us.
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  idleTimeout: 60000,
  maxIdle: 10
});

module.exports = pool;
