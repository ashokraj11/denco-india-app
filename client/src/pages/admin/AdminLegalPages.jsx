import { useEffect, useState } from 'react';
import { api } from '../../api/client';

function PageEditor({ page, onSaved }) {
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await api.put(`/admin/legal-pages/${page.slug}`, { title, content });
      setSaved(true);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form-card" style={{ maxWidth: 760, marginBottom: '1.5rem' }}>
      <h3 style={{ color: 'var(--navy)', fontSize: '1.05rem', margin: 0 }}>{page.title}</h3>
      <p style={{ margin: 0, fontSize: '.82rem', color: 'var(--mute)' }}>/{page.slug}</p>
      <div className="form-group">
        <label>Page Title <span className="req">*</span></label>
        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Content <span className="req">*</span></label>
        <textarea rows={14} required value={content} onChange={(e) => setContent(e.target.value)} />
        <span style={{ fontSize: '.78rem', color: 'var(--mute)' }}>Plain text — line breaks are preserved exactly as typed on the live page.</span>
      </div>
      {error && <p className="form-note" style={{ color: '#D9611E' }}>{error}</p>}
      <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
        <button type="submit" className="btn btn-accent btn-sm" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        {saved && <span style={{ fontSize: '.82rem', color: 'var(--green)' }}>Saved</span>}
      </div>
    </form>
  );
}

export default function AdminLegalPages() {
  const [pages, setPages] = useState(null);
  const [error, setError] = useState(null);

  function load() {
    api.get('/legal-pages').then(setPages).catch((err) => setError(err.message));
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2 style={{ margin: '0 0 1.2rem' }}>Legal Pages</h2>
      <p className="form-note" style={{ marginTop: 0, marginBottom: '1.2rem' }}>
        Manage the content shown at /privacy-policy and /terms-conditions, linked from the footer.
      </p>

      {error && <p className="form-note" style={{ color: '#D9611E' }}>{error}</p>}
      {!pages && !error && <p style={{ color: 'var(--mute)' }}>Loading…</p>}

      {pages?.map((page) => (
        <PageEditor key={page.slug} page={page} onSaved={load} />
      ))}
    </div>
  );
}
