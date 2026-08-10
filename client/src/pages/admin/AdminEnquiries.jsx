import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function AdminEnquiries() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get(`/admin/enquiries?page=${page}&limit=25`)
      .then(setResult)
      .catch((err) => setError(err.message));
  }, [page]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await api.del(`/admin/enquiries/${id}`);
      setResult((r) => ({ ...r, data: r.data.filter((row) => row.id !== id) }));
    } catch (err) {
      setError(err.message);
    }
  }

  const totalPages = result ? Math.max(1, Math.ceil(result.total / result.limit)) : 1;

  return (
    <div>
      <h2 style={{ margin: '0 0 1.2rem' }}>Enquiries</h2>

      {error && <p className="form-note" style={{ color: '#D9611E' }}>{error}</p>}

      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
              {['Date', 'Name', 'Clinic', 'Email', 'Phone', 'Subject', 'Message', ''].map((h) => (
                <th key={h} style={{ padding: '.8rem 1rem', color: 'var(--mute)', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result?.data.map((row) => (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--line)', verticalAlign: 'top' }}>
                <td style={{ padding: '.8rem 1rem', whiteSpace: 'nowrap' }}>{new Date(row.createdAt).toLocaleString()}</td>
                <td style={{ padding: '.8rem 1rem' }}>{row.name}</td>
                <td style={{ padding: '.8rem 1rem' }}>{row.clinic || '—'}</td>
                <td style={{ padding: '.8rem 1rem' }}><a href={`mailto:${row.email}`}>{row.email}</a></td>
                <td style={{ padding: '.8rem 1rem' }}><a href={`tel:${row.phone}`}>{row.phone}</a></td>
                <td style={{ padding: '.8rem 1rem' }}>{row.subject}</td>
                <td style={{ padding: '.8rem 1rem', maxWidth: 280 }}>{row.message}</td>
                <td style={{ padding: '.8rem 1rem' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(row.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {result && result.data.length === 0 && (
              <tr><td colSpan={8} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--mute)' }}>No enquiries yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {result && totalPages > 1 && (
        <div style={{ display: 'flex', gap: '.6rem', justifyContent: 'center', marginTop: '1.2rem' }}>
          <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span style={{ alignSelf: 'center', fontSize: '.85rem', color: 'var(--mute)' }}>Page {page} of {totalPages}</span>
          <button className="btn btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
