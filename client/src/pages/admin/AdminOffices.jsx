import { useEffect, useState } from 'react';
import { api } from '../../api/client';

const EMPTY = { name: '', role: 'Area Manager', phone: '', is_head_office: false, display_order: 0, districtIds: [] };

export default function AdminOffices() {
  const [offices, setOffices] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    Promise.all([api.get('/offices'), api.get('/districts')])
      .then(([o, d]) => { setOffices(o); setDistricts(d); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function startCreate() {
    setEditingId('new');
    setForm(EMPTY);
  }

  function startEdit(office) {
    setEditingId(office.id);
    setForm({
      name: office.name,
      role: office.role,
      phone: office.phone,
      is_head_office: office.isHeadOffice,
      display_order: office.display_order || 0,
      districtIds: (office.districts || []).map((d) => d.id)
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
  }

  function toggleDistrict(id) {
    setForm((s) => ({
      ...s,
      districtIds: s.districtIds.includes(id)
        ? s.districtIds.filter((x) => x !== id)
        : [...s.districtIds, id]
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingId === 'new') {
        await api.post('/admin/offices', form);
      } else {
        await api.put(`/admin/offices/${editingId}`, form);
      }
      cancelEdit();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this Area Manager? Their districts will revert to "not yet serviced" unless another manager also covers them.')) return;
    try {
      await api.del(`/admin/offices/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <h2 style={{ margin: 0 }}>Area Managers &amp; Service Network</h2>
        {editingId === null && (
          <button className="btn btn-accent btn-sm" onClick={startCreate}>+ Add New</button>
        )}
      </div>

      <p style={{ color: 'var(--mute)', fontSize: '.85rem', marginTop: '-0.6rem', marginBottom: '1.2rem' }}>
        Districts you check below turn green on the public Service Network map immediately. Removing a district
        (or deleting the manager) reverts it to red, unless another Area Manager also covers it.
      </p>

      {error && <p className="form-note" style={{ color: '#D9611E' }}>{error}</p>}

      {editingId !== null && (
        <form onSubmit={handleSubmit} className="contact-form-card" style={{ marginBottom: '1.5rem', maxWidth: 640 }}>
          <h3 style={{ color: 'var(--navy)', fontSize: '1.05rem', margin: 0 }}>{editingId === 'new' ? 'Add New' : 'Edit'} Area Manager</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Name <span className="req">*</span></label>
              <input type="text" required value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Role <span className="req">*</span></label>
              <input type="text" required value={form.role} onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label>Phone <span className="req">*</span></label>
            <input type="text" required placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} />
          </div>
          <label className="form-consent">
            <input type="checkbox" checked={form.is_head_office} onChange={(e) => setForm((s) => ({ ...s, is_head_office: e.target.checked }))} />
            This is the Head Office (shown with a different icon)
          </label>
          <div className="form-group">
            <label>Covers Districts</label>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '.4rem',
              maxHeight: 220, overflowY: 'auto', border: '1px solid var(--line)', borderRadius: 10, padding: '.7rem'
            }}>
              {districts.map((d) => (
                <label key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontSize: '.85rem', fontWeight: 400 }}>
                  <input type="checkbox" checked={form.districtIds.includes(d.id)} onChange={() => toggleDistrict(d.id)} />
                  {d.name}
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '.6rem' }}>
            <button type="submit" className="btn btn-accent btn-sm" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={cancelEdit}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
              {['Name', 'Role', 'Phone', 'Districts', ''].map((h) => (
                <th key={h} style={{ padding: '.8rem 1rem', color: 'var(--mute)', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center' }}>Loading…</td></tr>}
            {!loading && offices.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--mute)' }}>No Area Managers yet.</td></tr>
            )}
            {offices.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '.8rem 1rem' }}>{o.name}</td>
                <td style={{ padding: '.8rem 1rem' }}>{o.role}</td>
                <td style={{ padding: '.8rem 1rem' }}>{o.phone}</td>
                <td style={{ padding: '.8rem 1rem' }}>{(o.districts || []).length} district(s)</td>
                <td style={{ padding: '.8rem 1rem', whiteSpace: 'nowrap' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => startEdit(o)} style={{ marginRight: '.5rem' }}>Edit</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(o.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
