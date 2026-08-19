import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import MediaUploadField from '../../components/admin/MediaUploadField';
import Lightbox from '../../components/Lightbox';
import { resolveImageUrl } from '../../utils/resolveImageUrl';

const EMPTY = { title: '', media_type: 'image', media_url: '', display_order: 0 };

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [zoomed, setZoomed] = useState(null);

  function load() {
    setLoading(true);
    api.get('/gallery')
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
    setForm({ title: item.title, media_type: item.mediaType, media_url: item.mediaUrl, display_order: item.display_order || 0 });
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
        await api.post('/admin/gallery', form);
      } else {
        await api.put(`/admin/gallery/${editingId}`, form);
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
    if (!window.confirm('Delete this gallery item?')) return;
    try {
      await api.del(`/admin/gallery/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <h2 style={{ margin: 0 }}>Gallery</h2>
        {editingId === null && (
          <button className="btn btn-accent btn-sm" onClick={startCreate}>+ Add New</button>
        )}
      </div>

      {error && <p className="form-note" style={{ color: '#D9611E' }}>{error}</p>}

      {editingId !== null && (
        <form onSubmit={handleSubmit} className="contact-form-card" style={{ marginBottom: '1.5rem', maxWidth: 560 }}>
          <h3 style={{ color: 'var(--navy)', fontSize: '1.05rem', margin: 0 }}>{editingId === 'new' ? 'Add New' : 'Edit'}</h3>
          <div className="form-group">
            <label>Title <span className="req">*</span></label>
            <input type="text" required value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
          </div>
          <MediaUploadField
            label="Photo or Video"
            url={form.media_url}
            type={form.media_type}
            onChange={({ url, type }) => setForm((s) => ({ ...s, media_url: url, media_type: type || s.media_type }))}
          />
          <div className="form-group">
            <label>Display Order</label>
            <input type="number" value={form.display_order} onChange={(e) => setForm((s) => ({ ...s, display_order: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: '.6rem' }}>
            <button type="submit" className="btn btn-accent btn-sm" disabled={saving || !form.media_url}>{saving ? 'Saving…' : 'Save'}</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={cancelEdit}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
              {['', 'Title', 'Type', 'Order', ''].map((h) => (
                <th key={h} style={{ padding: '.8rem 1rem', color: 'var(--mute)', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center' }}>Loading…</td></tr>}
            {!loading && items.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--mute)' }}>No gallery items yet.</td></tr>
            )}
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '.6rem 1rem' }}>
                  {item.mediaType === 'video' ? (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video
                      src={resolveImageUrl(item.mediaUrl)}
                      muted
                      style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                      onClick={() => setZoomed({ img: resolveImageUrl(item.mediaUrl), title: item.title, type: 'video' })}
                    />
                  ) : (
                    <img
                      src={resolveImageUrl(item.mediaUrl)}
                      alt=""
                      style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                      onClick={() => setZoomed({ img: resolveImageUrl(item.mediaUrl), title: item.title })}
                    />
                  )}
                </td>
                <td style={{ padding: '.6rem 1rem' }}>{item.title}</td>
                <td style={{ padding: '.6rem 1rem', textTransform: 'capitalize' }}>{item.mediaType}</td>
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
