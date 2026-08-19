import { useEffect, useState } from 'react';
import { api } from '../../api/client';

const STATUSES = ['new', 'reviewed', 'shortlisted', 'rejected'];

export default function AdminJobApplications() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  function load() {
    setLoading(true);
    api.get('/admin/job-applications')
      .then(setRows)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleStatusChange(id, status) {
    try {
      await api.put(`/admin/job-applications/${id}`, { status });
      setRows((r) => r.map((row) => (row.id === id ? { ...row, status } : row)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDownload(row) {
    setDownloadingId(row.id);
    setError(null);
    try {
      await api.download(`/admin/job-applications/${row.id}/resume`, row.resumeFilename);
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this application? This also removes the uploaded resume file.')) return;
    try {
      await api.del(`/admin/job-applications/${id}`);
      setRows((r) => r.filter((row) => row.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <h2 style={{ margin: 0 }}>Job Applications</h2>
      </div>

      {error && <p className="form-note" style={{ color: '#D9611E' }}>{error}</p>}

      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
              {['Date', 'Name', 'Applying For', 'Email', 'Phone', 'Message', 'Status', 'Resume', ''].map((h) => (
                <th key={h} style={{ padding: '.8rem 1rem', color: 'var(--mute)', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={9} style={{ padding: '1.5rem', textAlign: 'center' }}>Loading…</td></tr>}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={9} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--mute)' }}>No applications yet.</td></tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--line)', verticalAlign: 'top' }}>
                <td style={{ padding: '.8rem 1rem', whiteSpace: 'nowrap' }}>{new Date(row.createdAt).toLocaleString()}</td>
                <td style={{ padding: '.8rem 1rem' }}>{row.name}</td>
                <td style={{ padding: '.8rem 1rem' }}>{row.jobTitle || 'General Application'}</td>
                <td style={{ padding: '.8rem 1rem' }}><a href={`mailto:${row.email}`}>{row.email}</a></td>
                <td style={{ padding: '.8rem 1rem' }}><a href={`tel:${row.phone}`}>{row.phone}</a></td>
                <td style={{ padding: '.8rem 1rem', maxWidth: 260 }}>{row.message || '—'}</td>
                <td style={{ padding: '.8rem 1rem' }}>
                  <select value={row.status} onChange={(e) => handleStatusChange(row.id, e.target.value)} style={{ textTransform: 'capitalize' }}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '.8rem 1rem' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDownload(row)} disabled={downloadingId === row.id}>
                    {downloadingId === row.id ? 'Downloading…' : 'Download'}
                  </button>
                </td>
                <td style={{ padding: '.8rem 1rem' }}>
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
