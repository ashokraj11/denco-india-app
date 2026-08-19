-- DENCO INDIA — MySQL schema
-- Run once against an empty `denco_india` database (see README).

CREATE TABLE IF NOT EXISTS admin_users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(120) NOT NULL,
  icon_key       VARCHAR(40) NOT NULL,
  category_slug  VARCHAR(60) NOT NULL,
  display_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS product_categories (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  slug           VARCHAR(60) NOT NULL UNIQUE,
  name           VARCHAR(120) NOT NULL,
  icon_key       VARCHAR(40) NOT NULL,
  display_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  category_id    INT NOT NULL,
  name           VARCHAR(160) NOT NULL,
  image_url      VARCHAR(500) NOT NULL,
  description    TEXT NOT NULL,
  display_order  INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id)
    REFERENCES product_categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS certifications (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(120) NOT NULL,
  description    VARCHAR(255) NOT NULL,
  image_url      VARCHAR(500) NOT NULL,
  display_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(160) NOT NULL,
  media_type     ENUM('image','video') NOT NULL DEFAULT 'image',
  media_url      VARCHAR(500) NOT NULL,
  display_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS testimonials (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(120) NOT NULL,
  role           VARCHAR(160) NULL,
  quote          TEXT NULL,
  media_type     ENUM('image','video') NOT NULL DEFAULT 'image',
  media_url      VARCHAR(500) NULL,
  display_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS trust_badges (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  image_url      VARCHAR(500) NOT NULL,
  label          VARCHAR(160) NULL,
  display_order  INT NOT NULL DEFAULT 0
);

-- Adds the column when re-running this file against a database created
-- before it existed (CREATE TABLE IF NOT EXISTS above is a no-op on an
-- existing table).
ALTER TABLE trust_badges ADD COLUMN IF NOT EXISTS label VARCHAR(160) NULL AFTER image_url;

CREATE TABLE IF NOT EXISTS hero_slides (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  image_url      VARCHAR(500) NOT NULL,
  display_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS offices (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(120) NOT NULL,
  role           VARCHAR(120) NOT NULL,
  phone          VARCHAR(32) NOT NULL,
  is_head_office TINYINT(1) NOT NULL DEFAULT 0,
  display_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS office_locations (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  office_id      INT NOT NULL,
  location_name  VARCHAR(120) NOT NULL,
  display_order  INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_office_locations_office FOREIGN KEY (office_id)
    REFERENCES offices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS faqs (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  category       VARCHAR(40) NOT NULL,
  question       VARCHAR(255) NOT NULL,
  answer_html    TEXT NOT NULL,
  display_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS stats (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  icon_key       VARCHAR(40) NOT NULL,
  label          VARCHAR(120) NOT NULL,
  display_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS districts (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(60) NOT NULL,
  slug           VARCHAR(60) NOT NULL UNIQUE,
  left_pct       DECIMAL(5,2) NOT NULL,
  top_pct        DECIMAL(5,2) NOT NULL,
  display_order  INT NOT NULL DEFAULT 0
);

-- Each row is one named area (town/locality) an office serves, tagged with
-- the district it falls in. A single district can appear more than once per
-- office (several towns in the same district), so there is no uniqueness
-- constraint on (office_id, district_id) here.
CREATE TABLE IF NOT EXISTS office_areas (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  office_id      INT NOT NULL,
  district_id    INT NOT NULL,
  area_name      VARCHAR(120) NOT NULL,
  display_order  INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_office_areas_office FOREIGN KEY (office_id)
    REFERENCES offices(id) ON DELETE CASCADE,
  CONSTRAINT fk_office_areas_district FOREIGN KEY (district_id)
    REFERENCES districts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS site_settings (
  id                 INT PRIMARY KEY DEFAULT 1,
  site_name          VARCHAR(80) NOT NULL DEFAULT 'DENCO',
  tagline            VARCHAR(80) NOT NULL DEFAULT 'INDIA',
  logo_url           VARCHAR(500) NULL,
  secondary_logo_url VARCHAR(500) NULL,
  brochure_url       VARCHAR(500) NULL,
  testimonials_visible TINYINT(1) NOT NULL DEFAULT 1,
  meta_title         VARCHAR(160) NOT NULL DEFAULT 'DENCO INDIA | Scientific Dental Laboratory & Digital Dentistry',
  meta_description   VARCHAR(300) NULL,
  contact_phone      VARCHAR(32) NULL,
  contact_email      VARCHAR(160) NULL,
  contact_address    VARCHAR(255) NULL,
  whatsapp_number    VARCHAR(32) NULL,
  facebook_url       VARCHAR(500) NULL,
  instagram_url      VARCHAR(500) NULL,
  linkedin_url       VARCHAR(500) NULL,
  youtube_url        VARCHAR(500) NULL,
  CONSTRAINT chk_site_settings_singleton CHECK (id = 1)
);

-- Adds columns when re-running this file against a database created before
-- they existed (CREATE TABLE IF NOT EXISTS above is a no-op on an existing
-- table, so each new column needs its own idempotent add).
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS secondary_logo_url VARCHAR(500) NULL AFTER logo_url;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS brochure_url VARCHAR(500) NULL AFTER secondary_logo_url;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS testimonials_visible TINYINT(1) NOT NULL DEFAULT 1 AFTER brochure_url;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS facebook_url VARCHAR(500) NULL AFTER whatsapp_number;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS instagram_url VARCHAR(500) NULL AFTER facebook_url;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500) NULL AFTER instagram_url;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS youtube_url VARCHAR(500) NULL AFTER linkedin_url;

CREATE TABLE IF NOT EXISTS enquiries (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  clinic      VARCHAR(160) NULL,
  email       VARCHAR(160) NOT NULL,
  phone       VARCHAR(32) NOT NULL,
  subject     VARCHAR(120) NOT NULL DEFAULT 'General Enquiry',
  message     TEXT NOT NULL,
  status      ENUM('new','contacted','closed') NOT NULL DEFAULT 'new',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_openings (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(160) NOT NULL,
  location       VARCHAR(120) NULL,
  employment_type VARCHAR(60) NOT NULL DEFAULT 'Full-time',
  description    TEXT NULL,
  is_active      TINYINT(1) NOT NULL DEFAULT 1,
  display_order  INT NOT NULL DEFAULT 0,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- resume_path stores just the stored filename (e.g. a UUID), NOT a public
-- URL -- resumes are candidate PII and are served only through an
-- authenticated admin download endpoint, never the public /uploads static
-- path. See server/src/middleware/upload.js (uploadResume, resumeDir).
CREATE TABLE IF NOT EXISTS job_applications (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  job_id          INT NULL,
  name            VARCHAR(120) NOT NULL,
  email           VARCHAR(160) NOT NULL,
  phone           VARCHAR(32) NOT NULL,
  message         TEXT NULL,
  resume_path     VARCHAR(255) NOT NULL,
  resume_filename VARCHAR(255) NOT NULL,
  status          ENUM('new','reviewed','shortlisted','rejected') NOT NULL DEFAULT 'new',
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_job_applications_job FOREIGN KEY (job_id)
    REFERENCES job_openings(id) ON DELETE SET NULL
);
