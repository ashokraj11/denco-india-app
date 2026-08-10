const pool = require('../config/db');

async function listOffices(req, res, next) {
  try {
    const [offices] = await pool.query(
      'SELECT id, name, role, phone, is_head_office AS isHeadOffice, display_order FROM offices ORDER BY display_order ASC'
    );
    const [areaRows] = await pool.query(
      `SELECT oa.office_id, oa.id, oa.area_name AS areaName, d.id AS districtId, d.name AS districtName
       FROM office_areas oa
       JOIN districts d ON d.id = oa.district_id
       ORDER BY oa.display_order ASC`
    );

    const result = offices.map((office) => ({
      ...office,
      isHeadOffice: !!office.isHeadOffice,
      areas: areaRows
        .filter((a) => a.office_id === office.id)
        .map((a) => ({ id: a.id, areaName: a.areaName, districtId: a.districtId, districtName: a.districtName }))
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

async function setOfficeAreas(conn, officeId, areas) {
  await conn.query('DELETE FROM office_areas WHERE office_id = ?', [officeId]);
  const list = Array.isArray(areas) ? areas : [];
  for (let i = 0; i < list.length; i++) {
    const { district_id, area_name } = list[i];
    if (!district_id || !area_name || !String(area_name).trim()) continue;
    await conn.query(
      'INSERT INTO office_areas (office_id, district_id, area_name, display_order) VALUES (?, ?, ?, ?)',
      [officeId, district_id, String(area_name).trim(), i]
    );
  }
}

async function createOffice(req, res, next) {
  const conn = await pool.getConnection();
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const { name, role, phone, is_head_office, display_order, areas } = req.body;

    await conn.beginTransaction();
    const [result] = await conn.query(
      'INSERT INTO offices (name, role, phone, is_head_office, display_order) VALUES (?, ?, ?, ?, ?)',
      [name, role, phone, is_head_office ? 1 : 0, display_order || 0]
    );
    await setOfficeAreas(conn, result.insertId, areas);
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
    const { name, role, phone, is_head_office, display_order, areas } = req.body;
    const { id } = req.params;

    await conn.beginTransaction();
    await conn.query(
      'UPDATE offices SET name = ?, role = ?, phone = ?, is_head_office = ?, display_order = ? WHERE id = ?',
      [name, role, phone, is_head_office ? 1 : 0, display_order || 0, id]
    );
    await setOfficeAreas(conn, id, areas);
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
    // office_areas has ON DELETE CASCADE, so this also frees up its districts (they
    // revert to "soon" automatically unless another office still covers them).
    await pool.query('DELETE FROM offices WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listOffices, createOffice, updateOffice, removeOffice };
