import { useEffect, useState } from 'react';
import { api } from '../../api/blogAdminClient';
import ImageUploadField from '../../components/admin/ImageUploadField';
import AdminFormModal from '../../components/admin/AdminFormModal';
import RichTextEditor from '../../components/admin/RichTextEditor';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import { slugify } from '../../utils/slugify';

const EMPTY = {
  category_id: '', slug: '', title: '', excerpt: '', cover_image_url: '',
  content: '', status: 'draft', meta_title: '', meta_description: ''
};

export default function BlogAdminPosts() {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  function load() {
    setLoading(true);
    Promise.all([api.get('/blog-admin/categories'), api.get('/blog-admin/posts')])
      .then(([cats, allPosts]) => {
        setCategories(cats);
        setPosts(allPosts);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function startCreate() {
    setEditingId('new');
    setForm(EMPTY);
    setSlugTouched(false);
  }

  function startEdit(post) {
    setEditingId(post.id);
    setForm({ ...EMPTY, ...post });
    // Existing posts already have a real slug -- editing the title shouldn't
    // silently rewrite an already-published/indexed URL.
    setSlugTouched(true);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
  }

  function updateTitle(title) {
    setForm((s) => ({ ...s, title, slug: slugTouched ? s.slug : slugify(title) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingId === 'new') {
        await api.post('/blog-admin/posts', form);
      } else {
        await api.put(`/blog-admin/posts/${editingId}`, form);
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
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await api.del(`/blog-admin/posts/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <h2 style={{ margin: 0 }}>Posts</h2>
        {editingId === null && (
          <button className="btn btn-accent btn-sm" onClick={startCreate} disabled={categories.length === 0}>+ Add New</button>
        )}
      </div>

      {categories.length === 0 && !loading && (
        <p className="form-note" style={{ color: '#D9611E' }}>Create a category first (see the Categories page).</p>
      )}
      {error && <p className="form-note" style={{ color: '#D9611E' }}>{error}</p>}

      <AdminFormModal open={editingId !== null} onClose={cancelEdit} wide>
        <form onSubmit={handleSubmit} className="contact-form-card">
          <h3 style={{ color: 'var(--navy)', fontSize: '1.05rem', margin: 0 }}>{editingId === 'new' ? 'Add New' : 'Edit'} Post</h3>

          <div className="form-group">
            <label>Category <span className="req">*</span></label>
            <select required value={form.category_id} onChange={(e) => setForm((s) => ({ ...s, category_id: e.target.value }))}>
              <option value="" disabled>Select…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Title <span className="req">*</span></label>
            <input type="text" required value={form.title} onChange={(e) => updateTitle(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Slug <span className="req">*</span></label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => { setSlugTouched(true); setForm((s) => ({ ...s, slug: e.target.value })); }}
            />
            <span style={{ fontSize: '.78rem', color: 'var(--mute)' }}>Auto-filled from Title — edit here to override.</span>
          </div>

          <div className="form-group">
            <label>Excerpt</label>
            <textarea rows={2} value={form.excerpt || ''} onChange={(e) => setForm((s) => ({ ...s, excerpt: e.target.value }))} />
          </div>

          <ImageUploadField
            label="Cover Image"
            value={form.cover_image_url}
            onChange={(url) => setForm((s) => ({ ...s, cover_image_url: url }))}
            endpoint="/blog-admin/uploads"
            api={api}
          />

          <RichTextEditor
            value={form.content}
            onChange={(html) => setForm((s) => ({ ...s, content: html }))}
            api={api}
          />

          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="form-group">
            <label>Meta Title</label>
            <input type="text" value={form.meta_title || ''} onChange={(e) => setForm((s) => ({ ...s, meta_title: e.target.value }))} />
            <span style={{ fontSize: '.78rem', color: 'var(--mute)' }}>Falls back to the post title if left blank.</span>
          </div>

          <div className="form-group">
            <label>Meta Description</label>
            <textarea rows={2} value={form.meta_description || ''} onChange={(e) => setForm((s) => ({ ...s, meta_description: e.target.value }))} />
            <span style={{ fontSize: '.78rem', color: 'var(--mute)' }}>Falls back to the excerpt if left blank.</span>
          </div>

          <div style={{ display: 'flex', gap: '.6rem' }}>
            <button type="submit" className="btn btn-accent btn-sm" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={cancelEdit}>Cancel</button>
          </div>
        </form>
      </AdminFormModal>

      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
              {['', 'Title', 'Category', 'Status', 'Published', ''].map((h, i) => (
                <th key={i} style={{ padding: '.8rem 1rem', color: 'var(--mute)', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} style={{ padding: '1.5rem', textAlign: 'center' }}>Loading…</td></tr>}
            {!loading && posts.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--mute)' }}>No posts yet.</td></tr>
            )}
            {posts.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '.6rem 1rem' }}>
                  {p.cover_image_url && (
                    <img src={resolveImageUrl(p.cover_image_url)} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} />
                  )}
                </td>
                <td style={{ padding: '.6rem 1rem' }}>{p.title}</td>
                <td style={{ padding: '.6rem 1rem' }}>{p.category_name}</td>
                <td style={{ padding: '.6rem 1rem', textTransform: 'capitalize' }}>{p.status}</td>
                <td style={{ padding: '.6rem 1rem' }}>{p.published_at ? new Date(p.published_at).toLocaleDateString() : '—'}</td>
                <td style={{ padding: '.6rem 1rem', whiteSpace: 'nowrap' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => startEdit(p)} style={{ marginRight: '.5rem' }}>Edit</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
