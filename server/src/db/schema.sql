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
  meta_title         VARCHAR(160) NOT NULL DEFAULT 'DENCO INDIA | Scientific Dental Laboratory & Digital Dentistry',
  meta_description   VARCHAR(300) NULL,
  contact_phone      VARCHAR(32) NULL,
  contact_email      VARCHAR(160) NULL,
  contact_address    VARCHAR(255) NULL,
  whatsapp_number    VARCHAR(32) NULL,
  CONSTRAINT chk_site_settings_singleton CHECK (id = 1)
);

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
