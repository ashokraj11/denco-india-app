import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import ImageUploadField from '../../components/admin/ImageUploadField';
import Lightbox from '../../components/Lightbox';
import { resolveImageUrl } from '../../utils/resolveImageUrl';

const EMPTY = { image_url: '', label: '', display_order: 0 };

export default function AdminTrustBadges() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [zoomed, setZoomed] = useState(null);

  function load() {
    setLoading(true);
    api.get('/trust-badges')
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function startCreate() {
    setEditingId('new');
    setForm(EMPTY);
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({ image_url: item.imageUrl, label: item.label || '', display_order: item.display_order || 0 });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingId === 'new') {
        await api.post('/admin/trust-badges', form);
      } else {
        await api.put(`/admin/trust-badges/${editingId}`, form);
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
    if (!window.confirm('Delete this badge?')) return;
    try {
      await api.del(`/admin/trust-badges/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <h2 style={{ margin: 0 }}>Trust Badges</h2>
        {editingId === null && (
          <button className="btn btn-accent btn-sm" onClick={startCreate}>+ Add New</button>
        )}
      </div>
      <p className="form-note" style={{ marginTop: 0, marginBottom: '1.2rem' }}>
        Small square images (client logos, award badges, certifications) that scroll in the dark band below the hero section.
      </p>

      {error && <p className="form-note" style={{ color: '#D9611E' }}>{error}</p>}

      {editingId !== null && (
        <form onSubmit={handleSubmit} className="contact-form-card" style={{ marginBottom: '1.5rem', maxWidth: 560 }}>
          <h3 style={{ color: 'var(--navy)', fontSize: '1.05rem', margin: 0 }}>{editingId === 'new' ? 'Add New' : 'Edit'}</h3>
          <ImageUploadField label="Badge Image" value={form.image_url} onChange={(url) => setForm((s) => ({ ...s, image_url: url }))} />
          <div className="form-group">
            <label>Label (used as alt text — e.g. "ISO 9001:2015 Certified")</label>
            <input type="text" placeholder="e.g. ISO 9001:2015 Certified" value={form.label} onChange={(e) => setForm((s) => ({ ...s, label: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Display Order</label>
            <input type="number" value={form.display_order} onChange={(e) => setForm((s) => ({ ...s, display_order: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: '.6rem' }}>
            <button type="submit" className="btn btn-accent btn-sm" disabled={saving || !form.image_url}>{saving ? 'Saving…' : 'Save'}</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={cancelEdit}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
              {['', 'Order', ''].map((h) => (
                <th key={h} style={{ padding: '.8rem 1rem', color: 'var(--mute)', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={3} style={{ padding: '1.5rem', textAlign: 'center' }}>Loading…</td></tr>}
            {!loading && items.length === 0 && (
              <tr><td colSpan={3} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--mute)' }}>No badges yet.</td></tr>
            )}
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '.6rem 1rem' }}>
                  <img
                    src={resolveImageUrl(item.imageUrl)}
                    alt={item.label || ''}
                    style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 8, background: 'var(--mist)', padding: 4, cursor: 'pointer' }}
                    onClick={() => setZoomed({ img: resolveImageUrl(item.imageUrl), title: item.label })}
                  />
                </td>
                <td style={{ padding: '.6rem 1rem' }}>{item.display_order}</td>
                <td style={{ padding: '.6rem 1rem', whiteSpace: 'nowrap' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => startEdit(item)} style={{ marginRight: '.5rem' }}>Edit</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Lightbox item={zoomed} onClose={() => setZoomed(null)} />
    </div>
  );
}
