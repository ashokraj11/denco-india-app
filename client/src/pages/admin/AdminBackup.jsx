import { useState } from 'react';
import { api } from '../../api/client';

function RestorePanel({ title, description, confirmWord, accept, onRestore }) {
  const [file, setFile] = useState(null);
  const [confirmText, setConfirmText] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const canSubmit = file && confirmText.trim().toUpperCase() === confirmWord;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await onRestore(file);
      setMessage('Restored successfully.');
      setFile(null);
      setConfirmText('');
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form-card" style={{ maxWidth: 520 }}>
      <h3 style={{ color: 'var(--navy)', fontSize: '1.05rem', margin: 0 }}>{title}</h3>
      <p style={{ fontSize: '.85rem', color: '#D9611E', margin: 0, fontWeight: 600 }}>
        Warning: this replaces {description} with the contents of the file you upload. This cannot be undone —
        download a fresh backup first if you're not sure.
      </p>
      <div className="form-group">
        <label>Backup file</label>
        <input type="file" accept={accept} required onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      <div className="form-group">
        <label>Type {confirmWord} to confirm</label>
        <input type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder={confirmWord} />
      </div>
      {error && <p className="form-note" style={{ color: '#D9611E' }}>{error}</p>}
      {message && <p className="form-note">{message}</p>}
      <button type="submit" className="btn btn-accent btn-sm" disabled={!canSubmit || busy}>
        {busy ? 'Restoring…' : 'Restore'}
      </button>
    </form>
  );
}

export default function AdminBackup() {
  const [dbProgress, setDbProgress] = useState(null);
  const [filesProgress, setFilesProgress] = useState(null);
  const [downloadError, setDownloadError] = useState(null);

  async function downloadDatabase() {
    setDbProgress(0);
    setDownloadError(null);
    try {
      await api.download('/admin/backup/database', 'denco-database-backup.json', setDbProgress);
    } catch (err) {
      setDownloadError(err.message);
    } finally {
      setDbProgress(null);
    }
  }

  async function downloadFiles() {
    setFilesProgress(0);
    setDownloadError(null);
    try {
      await api.download('/admin/backup/files', 'denco-files-backup.zip', setFilesProgress);
    } catch (err) {
      setDownloadError(err.message);
    } finally {
      setFilesProgress(null);
    }
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 .3rem' }}>Backup &amp; Restore</h2>
      <p style={{ color: 'var(--mute)', fontSize: '.88rem', marginTop: 0, marginBottom: '1.5rem' }}>
        The database backup covers products, categories, certifications, services, area managers, districts, FAQs,
        stats, gallery entries, site settings and enquiries (not the admin login itself). The files backup covers
        every image/video uploaded through this admin panel.
      </p>

      {downloadError && <p className="form-note" style={{ color: '#D9611E', maxWidth: 520 }}>{downloadError}</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="contact-form-card" style={{ maxWidth: 320 }}>
          <h3 style={{ color: 'var(--navy)', fontSize: '1.05rem', margin: 0 }}>Download Database Backup</h3>
          <p style={{ fontSize: '.85rem', color: 'var(--mute)', margin: 0 }}>Saves a .json file with all content.</p>
          <button type="button" className="btn btn-accent btn-sm" onClick={downloadDatabase} disabled={dbProgress !== null}>
            {dbProgress === null ? 'Download' : dbProgress > 0 ? `Downloading… ${dbProgress}%` : 'Preparing…'}
          </button>
          {dbProgress !== null && (
            <div style={{ height: 5, borderRadius: 3, background: 'var(--mist)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${dbProgress}%`, background: 'var(--accent)', transition: 'width .2s ease' }} />
            </div>
          )}
        </div>
        <div className="contact-form-card" style={{ maxWidth: 320 }}>
          <h3 style={{ color: 'var(--navy)', fontSize: '1.05rem', margin: 0 }}>Download Files Backup</h3>
          <p style={{ fontSize: '.85rem', color: 'var(--mute)', margin: 0 }}>Saves a .zip of every uploaded image/video.</p>
          <button type="button" className="btn btn-accent btn-sm" onClick={downloadFiles} disabled={filesProgress !== null}>
            {filesProgress === null ? 'Download' : filesProgress > 0 ? `Downloading… ${filesProgress}%` : 'Preparing…'}
          </button>
          {filesProgress !== null && (
            <div style={{ height: 5, borderRadius: 3, background: 'var(--mist)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${filesProgress}%`, background: 'var(--accent)', transition: 'width .2s ease' }} />
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <RestorePanel
          title="Restore Database"
          description="all current content in the database"
          confirmWord="RESTORE"
          accept="application/json,.json"
          onRestore={(file) => api.uploadBackup('/admin/backup/database/restore', file)}
        />
        <RestorePanel
          title="Restore Files"
          description="uploaded images/videos with matching filenames"
          confirmWord="RESTORE"
          accept="application/zip,.zip"
          onRestore={(file) => api.uploadBackup('/admin/backup/files/restore', file)}
        />
      </div>
    </div>
  );
}
