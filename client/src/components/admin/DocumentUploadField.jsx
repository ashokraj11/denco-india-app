import { useState } from 'react';
import { api } from '../../api/client';
import { resolveImageUrl } from '../../utils/resolveImageUrl';

export default function DocumentUploadField({ label = 'Document', value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const result = await api.uploadDocument('/admin/document-uploads', file);
      onChange(result.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  const currentUrl = resolveImageUrl(value);

  return (
    <div className="form-group">
      <label>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', flexWrap: 'wrap' }}>
        {currentUrl && (
          <a href={currentUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '.85rem' }}>View current PDF</a>
        )}
        <input type="file" accept="application/pdf" onChange={handleFile} disabled={uploading} />
        {uploading && <span style={{ fontSize: '.8rem', color: 'var(--mute)' }}>Uploading…</span>}
      </div>
      {error && <span style={{ color: '#D9611E', fontSize: '.8rem' }}>{error}</span>}
    </div>
  );
}
