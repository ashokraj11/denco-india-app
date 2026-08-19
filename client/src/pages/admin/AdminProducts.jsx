import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import ImageUploadField from '../../components/admin/ImageUploadField';
import Lightbox from '../../components/Lightbox';
import { resolveImageUrl } from '../../utils/resolveImageUrl';

const EMPTY = { category_id: '', name: '', image_url: '', description: '', display_order: 0 };

export default function AdminProducts() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [zoomed, setZoomed] = useState(null);

  function load() {
    setLoading(true);
    Promise.all([api.get('/admin/categories'), api.get('/products')])
      .then(([cats, nestedCats]) => {
        setCategories(cats);
        // Flatten nested {category -> products[]} into a plain product list,
        // reattaching category_id (stripped from the public shape) from the group it came from.
        const flat = nestedCats.flatMap((cat) => cat.products.map((p) => ({ ...p, category_id: cat.id })));
        setProducts(flat);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function startCreate() {
    setEditingId('new');
    setForm(EMPTY);
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({ ...EMPTY, ...p });
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
        await api.post('/admin/products', form);
      } else {
        await api.put(`/admin/products/${editingId}`, form);
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
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.del(`/admin/products/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const categoryName = (id) => categories.find((c) => c.id === id)?.name || '—';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <h2 style={{ margin: 0 }}>Products</h2>
        {editingId === null && (
          <button className="btn btn-accent btn-sm" onClick={startCreate} disabled={categories.length === 0}>+ Add New</button>
        )}
      </div>

      {categories.length === 0 && !loading && (
        <p className="form-note" style={{ color: '#D9611E' }}>Create a product category first (see the Categories page).</p>
      )}
      {error && <p className="form-note" style={{ color: '#D9611E' }}>{error}</p>}

      {editingId !== null && (
        <form onSubmit={handleSubmit} className="contact-form-card" style={{ marginBottom: '1.5rem', maxWidth: 560 }}>
          <h3 style={{ color: 'var(--navy)', fontSize: '1.05rem', margin: 0 }}>{editingId === 'new' ? 'Add New' : 'Edit'} Product</h3>
          <div className="form-group">
            <label>Category <span className="req">*</span></label>
            <select
              required
              value={form.category_id}
              onChange={(e) => setForm((s) => ({ ...s, category_id: e.target.value }))}
            >
              <option value="" disabled>Select…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Name <span className="req">*</span></label>
            <input type="text" required value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          </div>
          <ImageUploadField label="Product Image" value={form.image_url} onChange={(url) => setForm((s) => ({ ...s, image_url: url }))} />
          <div className="form-group">
            <label>Description <span className="req">*</span></label>
            <textarea rows={3} required value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Display Order</label>
            <input type="number" value={form.display_order} onChange={(e) => setForm((s) => ({ ...s, display_order: e.target.value }))} />
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
              {['', 'Name', 'Category', 'Order', ''].map((h) => (
                <th key={h} style={{ padding: '.8rem 1rem', color: 'var(--mute)', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center' }}>Loading…</td></tr>}
            {!loading && products.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--mute)' }}>No products yet.</td></tr>
            )}
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '.6rem 1rem' }}>
                  <img
                    src={resolveImageUrl(p.image_url)}
                    alt=""
                    style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                    onClick={() => setZoomed({ img: resolveImageUrl(p.image_url), title: p.name })}
                  />
                </td>
                <td style={{ padding: '.6rem 1rem' }}>{p.name}</td>
                <td style={{ padding: '.6rem 1rem' }}>{categoryName(p.category_id)}</td>
                <td style={{ padding: '.6rem 1rem' }}>{p.display_order}</td>
                <td style={{ padding: '.6rem 1rem', whiteSpace: 'nowrap' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => startEdit(p)} style={{ marginRight: '.5rem' }}>Edit</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
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
