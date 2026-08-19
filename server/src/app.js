const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
require('./config/loadEnv');

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
const legalPagesRoutes = require('./routes/legalPages');
const galleryRoutes = require('./routes/gallery');
const heroSlidesRoutes = require('./routes/heroSlides');
const testimonialsRoutes = require('./routes/testimonials');
const trustBadgesRoutes = require('./routes/trustBadges');
const enquiriesRoutes = require('./routes/enquiries');
const jobsRoutes = require('./routes/jobs');
const jobApplicationsRoutes = require('./routes/jobApplications');
const adminRoutes = require('./routes/admin');
const adminJobsRoutes = require('./routes/adminJobs');
const adminJobApplicationsRoutes = require('./routes/adminJobApplications');
const adminProductsRoutes = require('./routes/adminProducts');
const adminCategoriesRoutes = require('./routes/adminCategories');
const adminCertificationsRoutes = require('./routes/adminCertifications');
const adminServicesRoutes = require('./routes/adminServices');
const adminOfficesRoutes = require('./routes/adminOffices');
const adminFaqsRoutes = require('./routes/adminFaqs');
const adminSettingsRoutes = require('./routes/adminSettings');
const adminLegalPagesRoutes = require('./routes/adminLegalPages');
const adminUploadsRoutes = require('./routes/adminUploads');
const adminHeroUploadsRoutes = require('./routes/adminHeroUploads');
const adminDocumentUploadsRoutes = require('./routes/adminDocumentUploads');
const adminGalleryRoutes = require('./routes/adminGallery');
const adminGalleryUploadsRoutes = require('./routes/adminGalleryUploads');
const adminHeroSlidesRoutes = require('./routes/adminHeroSlides');
const adminTestimonialsRoutes = require('./routes/adminTestimonials');
const adminTrustBadgesRoutes = require('./routes/adminTrustBadges');
const adminBackupRoutes = require('./routes/adminBackup');

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
  },
  // Cross-origin fetch() can only read a handful of "safe" response headers
  // by default -- Content-Disposition/Content-Length aren't in that list, so
  // without this the client can't see the backup filename or total size to
  // compute a download progress percentage from (client/api on separate
  // subdomains in production means every API call here is cross-origin).
  exposedHeaders: ['Content-Disposition', 'Content-Length']
}));
// Backup downloads are excluded -- gzip-compressing the response strips the
// Content-Length header (final size isn't known until the stream ends), and
// the client needs that header up front to compute a download percentage.
app.use(compression({
  filter: (req, res) => (req.path.startsWith('/api/admin/backup') ? false : compression.filter(req, res))
}));
app.use(express.json());
// Filenames under /uploads are random UUIDs assigned once at upload time and
// never reused for different content, so caching them for a year is safe --
// an edited/replaced image gets a brand new filename, not the old one.
app.use('/uploads', express.static(uploadDir, { maxAge: '365d', immutable: true }));

// API responses are dynamic and must never be served stale by a CDN, proxy,
// or the browser's own cache -- e.g. site settings edited in the admin panel
// need to show up immediately, not after some cache's TTL expires.
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/services', servicesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/certifications', certificationsRoutes);
app.use('/api/offices', officesRoutes);
app.use('/api/faqs', faqsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/districts', districtsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/legal-pages', legalPagesRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/hero-slides', heroSlidesRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/trust-badges', trustBadgesRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/job-applications', jobApplicationsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/jobs', adminJobsRoutes);
app.use('/api/admin/job-applications', adminJobApplicationsRoutes);
app.use('/api/admin/products', adminProductsRoutes);
app.use('/api/admin/categories', adminCategoriesRoutes);
app.use('/api/admin/certifications', adminCertificationsRoutes);
app.use('/api/admin/services', adminServicesRoutes);
app.use('/api/admin/offices', adminOfficesRoutes);
app.use('/api/admin/faqs', adminFaqsRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);
app.use('/api/admin/legal-pages', adminLegalPagesRoutes);
app.use('/api/admin/uploads', adminUploadsRoutes);
app.use('/api/admin/hero-uploads', adminHeroUploadsRoutes);
app.use('/api/admin/document-uploads', adminDocumentUploadsRoutes);
app.use('/api/admin/gallery', adminGalleryRoutes);
app.use('/api/admin/gallery-uploads', adminGalleryUploadsRoutes);
app.use('/api/admin/hero-slides', adminHeroSlidesRoutes);
app.use('/api/admin/testimonials', adminTestimonialsRoutes);
app.use('/api/admin/trust-badges', adminTrustBadgesRoutes);
app.use('/api/admin/backup', adminBackupRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
