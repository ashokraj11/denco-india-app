const fs = require('fs');
const AdmZip = require('adm-zip');
const pool = require('../config/db');
const { uploadDir } = require('../middleware/upload');

const BACKUP_VERSION = 1;

// admin_users is intentionally excluded (don't want password hashes in a
// downloadable file); office_locations is excluded too (deprecated/unused
// legacy table, superseded by office_areas). Order here is just how they're
// listed in the export — restore doesn't depend on it since FK checks are
// disabled for the duration of the restore transaction.
const TABLE_SCHEMAS = {
  districts: ['id', 'name', 'slug', 'left_pct', 'top_pct', 'display_order'],
  product_categories: ['id', 'slug', 'name', 'icon_key', 'display_order'],
  products: ['id', 'category_id', 'name', 'image_url', 'description', 'display_order'],
  services: ['id', 'title', 'icon_key', 'category_slug', 'display_order'],
  certifications: ['id', 'title', 'description', 'image_url', 'display_order'],
  offices: ['id', 'name', 'role', 'phone', 'is_head_office', 'display_order'],
  office_areas: ['id', 'office_id', 'district_id', 'area_name', 'display_order'],
  faqs: ['id', 'category', 'question', 'answer_html', 'display_order'],
  stats: ['id', 'icon_key', 'label', 'display_order'],
  gallery_items: ['id', 'title', 'media_type', 'media_url', 'display_order'],
  hero_slides: ['id', 'image_url', 'display_order'],
  testimonials: ['id', 'name', 'role', 'quote', 'media_type', 'media_url', 'display_order'],
  site_settings: ['id', 'site_name', 'tagline', 'logo_url', 'secondary_logo_url', 'brochure_url', 'testimonials_visible', 'meta_title', 'meta_description', 'contact_phone', 'contact_email', 'contact_address', 'whatsapp_number'],
  enquiries: ['id', 'name', 'clinic', 'email', 'phone', 'subject', 'message', 'status', 'created_at']
};
const TABLE_NAMES = Object.keys(TABLE_SCHEMAS);

function escapeIdent(name) {
  return '`' + String(name).replace(/`/g, '``') + '`';
}

async function exportDatabase(req, res, next) {
  try {
    const tables = {};
    for (const table of TABLE_NAMES) {
      const [rows] = await pool.query(`SELECT * FROM ${escapeIdent(table)}`);
      tables[table] = rows;
    }
    const payload = { version: BACKUP_VERSION, exportedAt: new Date().toISOString(), tables };

    res.set('Content-Disposition', `attachment; filename="denco-database-backup-${Date.now()}.json"`);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(payload, null, 2));
  } catch (err) {
    next(err);
  }
}

async function importDatabase(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: 'No backup file provided (field name must be "backup")' });
  }

  let payload;
  try {
    payload = JSON.parse(req.file.buffer.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'That file is not valid JSON' });
  }
  if (payload.version !== BACKUP_VERSION || typeof payload.tables !== 'object' || !payload.tables) {
    return res.status(400).json({ error: 'This does not look like a DENCO INDIA database backup file' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');

    for (const table of TABLE_NAMES) {
      await conn.query(`TRUNCATE TABLE ${escapeIdent(table)}`);
    }

    for (const table of TABLE_NAMES) {
      const allowedColumns = TABLE_SCHEMAS[table];
      const rows = Array.isArray(payload.tables[table]) ? payload.tables[table] : [];
      for (const row of rows) {
        const columns = Object.keys(row).filter((c) => allowedColumns.includes(c));
        if (columns.length === 0) continue;
        const sql = `INSERT INTO ${escapeIdent(table)} (${columns.map(escapeIdent).join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`;
        await conn.query(sql, columns.map((c) => row[c]));
      }
    }

    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    await conn.commit();
    res.json({ ok: true, restoredTables: TABLE_NAMES });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
}

function exportFiles(req, res, next) {
  try {
    const zip = new AdmZip();
    if (fs.existsSync(uploadDir)) {
      zip.addLocalFolder(uploadDir);
    }
    res.set('Content-Disposition', `attachment; filename="denco-files-backup-${Date.now()}.zip"`);
    res.set('Content-Type', 'application/zip');
    res.send(zip.toBuffer());
  } catch (err) {
    next(err);
  }
}

function importFiles(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: 'No zip file provided (field name must be "backup")' });
  }
  try {
    const zip = new AdmZip(req.file.path);
    zip.extractAllTo(uploadDir, true);
    fs.unlink(req.file.path, () => {});
    res.json({ ok: true });
  } catch (err) {
    fs.unlink(req.file.path, () => {});
    next(err);
  }
}

module.exports = { exportDatabase, importDatabase, exportFiles, importFiles };
