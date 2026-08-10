const pool = require('../config/db');

async function listOffices(req, res, next) {
  try {
    const [offices] = await pool.query(
      'SELECT id, name, role, phone, is_head_office AS isHeadOffice FROM offices ORDER BY display_order ASC'
    );
    const [locations] = await pool.query(
      'SELECT office_id, location_name FROM office_locations ORDER BY display_order ASC'
    );

    const result = offices.map((office) => ({
      ...office,
      isHeadOffice: !!office.isHeadOffice,
      locations: locations
        .filter((l) => l.office_id === office.id)
        .map((l) => l.location_name)
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { listOffices };
