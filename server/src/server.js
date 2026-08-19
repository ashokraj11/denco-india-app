require('./config/loadEnv');
const app = require('./app');

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`DENCO INDIA API listening on http://localhost:${PORT}`);
});

// The gallery upload route accepts video files up to 3GB (see
// middleware/upload.js) -- Node's default socket timeouts would otherwise
// kill that connection partway through on anything but a fast link, well
// before the upload finishes.
server.requestTimeout = 0;
server.headersTimeout = 0;
server.timeout = 30 * 60 * 1000;
