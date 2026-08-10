const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { notFound, errorHandler } = require('./middleware/errorHandler');

const servicesRoutes = require('./routes/services');
const productsRoutes = require('./routes/products');
const certificationsRoutes = require('./routes/certifications');
const officesRoutes = require('./routes/offices');
const faqsRoutes = require('./routes/faqs');
const statsRoutes = require('./routes/stats');
const enquiriesRoutes = require('./routes/enquiries');
const adminRoutes = require('./routes/admin');

const app = express();

// CLIENT_ORIGIN may be a single origin or a comma-separated list
// (e.g. "https://dencoindia.com,https://www.dencoindia.com") so both the
// apex and www domains work in production without code changes.
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  }
}));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/services', servicesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/certifications', certificationsRoutes);
app.use('/api/offices', officesRoutes);
app.use('/api/faqs', faqsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
