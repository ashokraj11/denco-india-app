const pool = require('../config/db');

async function listOffices(req, res, next) {
  try {
    const [offices] = await pool.query(
      'SELECT id, name, role, phone, is_head_office AS isHeadOffice, display_order FROM offices ORDER BY display_order ASC'
    );
    const [districtRows] = await pool.query(
      `SELECT od.office_id, d.id, d.name
       FROM office_districts od
       JOIN districts d ON d.id = od.district_id
       ORDER BY d.display_order ASC`
    );

    const result = offices.map((office) => ({
      ...office,
      isHeadOffice: !!office.isHeadOffice,
      districts: districtRows
        .filter((d) => d.office_id === office.id)
        .map((d) => ({ id: d.id, name: d.name }))
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
}

function validate(body) {
  const { name, role, phone } = body || {};
  if (!name || !role || !phone) return 'name, role and phone are required';
  return null;
}

async function setOfficeDistricts(conn, officeId, districtIds) {
  await conn.query('DELETE FROM office_districts WHERE office_id = ?', [officeId]);
  const ids = Array.isArray(districtIds) ? [...new Set(districtIds)] : [];
  for (const districtId of ids) {
    await conn.query('INSERT INTO office_districts (office_id, district_id) VALUES (?, ?)', [officeId, districtId]);
  }
}

async function createOffice(req, res, next) {
  const conn = await pool.getConnection();
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { name, role, phone, is_head_office, display_order, districtIds } = req.body;

    await conn.beginTransaction();
    const [result] = await conn.query(
      'INSERT INTO offices (name, role, phone, is_head_office, display_order) VALUES (?, ?, ?, ?, ?)',
      [name, role, phone, is_head_office ? 1 : 0, display_order || 0]
    );
    await setOfficeDistricts(conn, result.insertId, districtIds);
    await conn.commit();

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
}

async function updateOffice(req, res, next) {
  const conn = await pool.getConnection();
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { name, role, phone, is_head_office, display_order, districtIds } = req.body;
    const { id } = req.params;

    await conn.beginTransaction();
    await conn.query(
      'UPDATE offices SET name = ?, role = ?, phone = ?, is_head_office = ?, display_order = ? WHERE id = ?',
      [name, role, phone, is_head_office ? 1 : 0, display_order || 0, id]
    );
    await setOfficeDistricts(conn, id, districtIds);
    await conn.commit();

    res.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
}

async function removeOffice(req, res, next) {
  try {
    // office_districts has ON DELETE CASCADE, so this also frees up its districts (they
    // revert to "soon" automatically unless another office still covers them).
    await pool.query('DELETE FROM offices WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listOffices, createOffice, updateOffice, removeOffice };
