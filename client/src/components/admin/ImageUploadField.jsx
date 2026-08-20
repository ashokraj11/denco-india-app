import { useState } from 'react';
import { api } from '../../api/client';
import { resolveImageUrl } from '../../utils/resolveImageUrl';

export default function ImageUploadField({ label = 'Image', value, onChange, endpoint = '/admin/uploads' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const result = await api.upload(endpoint, file);
      onChange(result.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  const preview = resolveImageUrl(value);

  return (
    <div className="form-group">
      <label>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
        {preview && (
          <img src={preview} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--line)' }} />
        )}
        <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
        {uploading && <span style={{ fontSize: '.8rem', color: 'var(--mute)' }}>Uploading…</span>}
        {preview && !uploading && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange('')}>Remove</button>
        )}
      </div>
      <input
        type="text"
        placeholder="…or paste an image URL"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        style={{ marginTop: '.5rem' }}
      />
      {error && <span style={{ color: '#D9611E', fontSize: '.8rem' }}>{error}</span>}
    </div>
  );
}
