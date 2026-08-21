import { useEffect, useState } from 'react';
import { api as defaultApi } from '../../api/client';
import ImageUploadField from './ImageUploadField';
import AdminFormModal from './AdminFormModal';
import { slugify } from '../../utils/slugify';

// Generic list + add/edit form + delete, driven by a field-schema config.
// Used for resources that are a flat list of similarly-shaped records
// (categories, certifications, services, FAQs). Products and Offices have
// enough special-case UI (nested categories, district picker) to stay as
// their own pages instead of being forced through this.
//
// fields: [{ name, label, type: 'text'|'textarea'|'select'|'number'|'image', required, options,
//            deriveFrom: '<other field name>' — auto-fills this field with a slugified version
//            of that field's value, until the admin edits this field directly. }]
export default function AdminCrudTable({ title, listPath, adminBasePath, columns, fields, emptyItem, api = defaultApi }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyItem);
  const [saving, setSaving] = useState(false);
  const [touchedFields, setTouchedFields] = useState(new Set());

  function load() {
    setLoading(true);
    api.get(listPath)
      .then(setRows)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [listPath]);

  function startCreate() {
    setEditingId('new');
    setForm(emptyItem);
    setTouchedFields(new Set());
  }

  function startEdit(row) {
    setEditingId(row.id);
    setForm({ ...emptyItem, ...row });
    // Existing records already have real values in their derived fields
    // (e.g. slug) — treat those as touched so editing the source field
    // (e.g. name) doesn't silently rewrite an already-published slug.
    setTouchedFields(new Set(fields.filter((f) => f.deriveFrom).map((f) => f.name)));
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyItem);
  }

  function updateField(name, value) {
    setForm((s) => {
      const next = { ...s, [name]: value };
      fields
        .filter((f) => f.deriveFrom === name && !touchedFields.has(f.name))
        .forEach((f) => { next[f.name] = slugify(value); });
      return next;
    });
  }

  function touchField(name) {
    setTouchedFields((s) => new Set(s).add(name));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingId === 'new') {
        await api.post(adminBasePath, form);
      } else {
        await api.put(`${adminBasePath}/${editingId}`, form);
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
    if (!window.confirm('Delete this? This cannot be undone.')) return;
    try {
      await api.del(`${adminBasePath}/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        {editingId === null && (
          <button className="btn btn-accent btn-sm" onClick={startCreate}>+ Add New</button>
        )}
      </div>

      {error && <p className="form-note" style={{ color: '#D9611E' }}>{error}</p>}

      <AdminFormModal open={editingId !== null} onClose={cancelEdit}>
        <form onSubmit={handleSubmit} className="contact-form-card">
          <h3 style={{ color: 'var(--navy)', fontSize: '1.05rem', margin: 0 }}>
            {editingId === 'new' ? 'Add New' : 'Edit'}
          </h3>
          {fields.map((f) => (
            <div className="form-group" key={f.name} style={{ display: f.type === 'image' ? 'contents' : undefined }}>
              {f.type === 'image' ? (
                <ImageUploadField
                  label={f.label}
                  value={form[f.name]}
                  onChange={(url) => setForm((s) => ({ ...s, [f.name]: url }))}
                  api={api}
                />
              ) : f.type === 'textarea' ? (
                <>
                  <label>{f.label}{f.required && <span className="req"> *</span>}</label>
                  <textarea
                    rows={4}
                    required={f.required}
                    value={form[f.name] || ''}
                    onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                  />
                  {f.hint && <span style={{ fontSize: '.78rem', color: 'var(--mute)' }}>{f.hint}</span>}
                </>
              ) : f.type === 'select' ? (
                <>
                  <label>{f.label}{f.required && <span className="req"> *</span>}</label>
                  <select
                    required={f.required}
                    value={form[f.name] || ''}
                    onChange={(e) => updateField(f.name, e.target.value)}
                  >
                    <option value="" disabled>Select…</option>
                    {f.options.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <label>{f.label}{f.required && <span className="req"> *</span>}</label>
                  <input
                    type={f.type === 'number' ? 'number' : 'text'}
                    required={f.required}
                    value={form[f.name] ?? ''}
                    onChange={(e) => {
                      if (f.deriveFrom) touchField(f.name);
                      updateField(f.name, e.target.value);
                    }}
                  />
                  {f.deriveFrom && <span style={{ fontSize: '.78rem', color: 'var(--mute)' }}>Auto-filled from {fields.find((x) => x.name === f.deriveFrom)?.label || f.deriveFrom} — edit here to override.</span>}
                </>
              )}
            </div>
          ))}
          <div style={{ display: 'flex', gap: '.6rem' }}>
            <button type="submit" className="btn btn-accent btn-sm" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={cancelEdit}>Cancel</button>
          </div>
        </form>
      </AdminFormModal>

      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
              {columns.map((c) => (
                <th key={c.key} style={{ padding: '.8rem 1rem', color: 'var(--mute)', fontWeight: 700 }}>{c.label}</th>
              ))}
              <th style={{ padding: '.8rem 1rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={columns.length + 1} style={{ padding: '1.5rem', textAlign: 'center' }}>Loading…</td></tr>}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={columns.length + 1} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--mute)' }}>Nothing here yet.</td></tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--line)' }}>
                {columns.map((c) => (
                  <td key={c.key} style={{ padding: '.8rem 1rem' }}>{c.render ? c.render(row) : row[c.key]}</td>
                ))}
                <td style={{ padding: '.8rem 1rem', whiteSpace: 'nowrap' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => startEdit(row)} style={{ marginRight: '.5rem' }}>Edit</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(row.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
