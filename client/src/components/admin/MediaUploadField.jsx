import { useState } from 'react';
import { api } from '../../api/client';
import { resolveImageUrl } from '../../utils/resolveImageUrl';

// Like ImageUploadField, but accepts images OR short video clips and reports
// back the detected media type alongside the uploaded URL.
export default function MediaUploadField({ label = 'Media', url, type, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const result = await api.uploadMedia('/admin/gallery-uploads', file);
      onChange({ url: result.url, type: result.type });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  const preview = resolveImageUrl(url);

  return (
    <div className="form-group">
      <label>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
        {preview && type === 'video' && (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video src={preview} muted style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--line)' }} />
        )}
        {preview && type !== 'video' && (
          <img src={preview} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--line)' }} />
        )}
        <input type="file" accept="image/*,video/mp4,video/webm,video/ogg,video/quicktime" onChange={handleFile} disabled={uploading} />
        {uploading && <span style={{ fontSize: '.8rem', color: 'var(--mute)' }}>Uploading… (videos can take a moment)</span>}
      </div>
      <div className="form-row" style={{ marginTop: '.5rem' }}>
        <input
          type="text"
          placeholder="…or paste a media URL"
          value={url || ''}
          onChange={(e) => onChange({ url: e.target.value, type })}
          style={{ flex: 2 }}
        />
        <select value={type || 'image'} onChange={(e) => onChange({ url, type: e.target.value })} style={{ flex: 1 }}>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </div>
      {error && <span style={{ color: '#D9611E', fontSize: '.8rem' }}>{error}</span>}
    </div>
  );
}
