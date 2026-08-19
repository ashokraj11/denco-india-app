import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import MediaUploadField from '../../components/admin/MediaUploadField';
import AdminFormModal from '../../components/admin/AdminFormModal';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import { useSiteSettings } from '../../context/SiteSettingsContext';

const EMPTY = { name: '', role: '', quote: '', media_type: 'image', media_url: '', display_order: 0 };

export default function AdminTestimonials() {
  const { settings, loading: settingsLoading, reload: reloadSettings } = useSiteSettings();
  const [visibleSaving, setVisibleSaving] = useState(false);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api.get('/testimonials')
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function toggleVisible() {
    setVisibleSaving(true);
    try {
      await api.put('/admin/settings', { testimonials_visible: !settings.testimonialsVisible });
      reloadSettings();
    } catch (err) {
      setError(err.message);
    } finally {
      setVisibleSaving(false);
    }
  }

  function startCreate() {
    setEditingId('new');
    setForm(EMPTY);
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      role: item.role || '',
      quote: item.quote || '',
      media_type: item.mediaType,
      media_url: item.mediaUrl || '',
      display_order: item.display_order || 0
    });
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
        await api.post('/admin/testimonials', form);
      } else {
        await api.put(`/admin/testimonials/${editingId}`, form);
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
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await api.del(`/admin/testimonials/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <h2 style={{ margin: 0 }}>Testimonials</h2>
        {editingId === null && (
          <button className="btn btn-accent btn-sm" onClick={startCreate}>+ Add New</button>
        )}
      </div>

      <div className="contact-form-card" style={{ marginBottom: '1.5rem', maxWidth: 560, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <strong style={{ color: 'var(--navy)' }}>Show section on website</strong>
          <p className="form-note" style={{ margin: '.3rem 0 0' }}>
            Hides or shows the whole Testimonials section on the homepage, without deleting anything below.
          </p>
        </div>
        <button
          type="button"
          className={`btn btn-sm ${settings.testimonialsVisible ? 'btn-accent' : 'btn-ghost'}`}
          onClick={toggleVisible}
          disabled={settingsLoading || visibleSaving}
        >
          {settings.testimonialsVisible ? 'Visible' : 'Hidden'}
        </button>
      </div>

      {error && <p className="form-note" style={{ color: '#D9611E' }}>{error}</p>}

      <AdminFormModal open={editingId !== null} onClose={cancelEdit}>
        <form onSubmit={handleSubmit} className="contact-form-card">
          <h3 style={{ color: 'var(--navy)', fontSize: '1.05rem', margin: 0 }}>{editingId === 'new' ? 'Add New' : 'Edit'}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Name <span className="req">*</span></label>
              <input type="text" required value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Role / Clinic</label>
              <input type="text" placeholder="e.g. Dr. Kumar, Smile Dental Clinic" value={form.role} onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label>Quote</label>
            <textarea rows={3} value={form.quote} onChange={(e) => setForm((s) => ({ ...s, quote: e.target.value }))} />
          </div>
          <MediaUploadField
            label="Photo or Video (optional)"
            url={form.media_url}
            type={form.media_type}
            onChange={({ url, type }) => setForm((s) => ({ ...s, media_url: url, media_type: type || s.media_type }))}
          />
          <div className="form-group">
            <label>Display Order</label>
            <input type="number" value={form.display_order} onChange={(e) => setForm((s) => ({ ...s, display_order: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: '.6rem' }}>
            <button type="submit" className="btn btn-accent btn-sm" disabled={saving || !form.name}>{saving ? 'Saving…' : 'Save'}</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={cancelEdit}>Cancel</button>
          </div>
        </form>
      </AdminFormModal>

      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
              {['', 'Name', 'Role', 'Order', ''].map((h) => (
                <th key={h} style={{ padding: '.8rem 1rem', color: 'var(--mute)', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center' }}>Loading…</td></tr>}
            {!loading && items.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--mute)' }}>No testimonials yet.</td></tr>
            )}
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '.6rem 1rem' }}>
                  {item.mediaUrl ? (
                    item.mediaType === 'video' ? (
                      // eslint-disable-next-line jsx-a11y/media-has-caption
                      <video src={resolveImageUrl(item.mediaUrl)} muted style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <img src={resolveImageUrl(item.mediaUrl)} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} />
                    )
                  ) : (
                    <span style={{ color: 'var(--mute)' }}>—</span>
                  )}
                </td>
                <td style={{ padding: '.6rem 1rem' }}>{item.name}</td>
                <td style={{ padding: '.6rem 1rem' }}>{item.role}</td>
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
    </div>
  );
}
