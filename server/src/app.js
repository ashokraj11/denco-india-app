const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { notFound, errorHandler } = require('./middleware/errorHandler');
const { uploadDir } = require('./middleware/upload');

const servicesRoutes = require('./routes/services');
const productsRoutes = require('./routes/products');
const certificationsRoutes = require('./routes/certifications');
const officesRoutes = require('./routes/offices');
const faqsRoutes = require('./routes/faqs');
const statsRoutes = require('./routes/stats');
const districtsRoutes = require('./routes/districts');
const settingsRoutes = require('./routes/settings');
const galleryRoutes = require('./routes/gallery');
const enquiriesRoutes = require('./routes/enquiries');
const adminRoutes = require('./routes/admin');
const adminProductsRoutes = require('./routes/adminProducts');
const adminCategoriesRoutes = require('./routes/adminCategories');
const adminCertificationsRoutes = require('./routes/adminCertifications');
const adminServicesRoutes = require('./routes/adminServices');
const adminOfficesRoutes = require('./routes/adminOffices');
const adminFaqsRoutes = require('./routes/adminFaqs');
const adminSettingsRoutes = require('./routes/adminSettings');
const adminUploadsRoutes = require('./routes/adminUploads');
const adminGalleryRoutes = require('./routes/adminGallery');
const adminGalleryUploadsRoutes = require('./routes/adminGalleryUploads');

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
app.use('/uploads', express.static(uploadDir));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/services', servicesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/certifications', certificationsRoutes);
app.use('/api/offices', officesRoutes);
app.use('/api/faqs', faqsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/districts', districtsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/products', adminProductsRoutes);
app.use('/api/admin/categories', adminCategoriesRoutes);
app.use('/api/admin/certifications', adminCertificationsRoutes);
app.use('/api/admin/services', adminServicesRoutes);
app.use('/api/admin/offices', adminOfficesRoutes);
app.use('/api/admin/faqs', adminFaqsRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);
app.use('/api/admin/uploads', adminUploadsRoutes);
app.use('/api/admin/gallery', adminGalleryRoutes);
app.use('/api/admin/gallery-uploads', adminGalleryUploadsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
