import { useEffect, useState } from 'react';
import { api } from '../../api/client';

const STATUSES = ['new', 'contacted', 'closed'];
const EMPTY_FILTERS = { search: '', status: '', from: '', to: '' };

function buildQuery(filters, extra = {}) {
  const params = new URLSearchParams({ ...extra });
  if (filters.search.trim()) params.set('search', filters.search.trim());
  if (filters.status) params.set('status', filters.status);
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  return params.toString();
}

export default function AdminEnquiries() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [exporting, setExporting] = useState(false);

  // Debounce free-text search so it doesn't fire a request per keystroke;
  // status/date filters apply immediately since those are discrete inputs.
  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      setFilters((f) => ({ ...f, search: searchInput }));
    }, 350);
    return () => clearTimeout(id);
  }, [searchInput]);

  useEffect(() => {
    const query = buildQuery(filters, { page, limit: 25 });
    api.get(`/admin/enquiries?${query}`)
      .then(setResult)
      .catch((err) => setError(err.message));
  }, [page, filters]);

  function updateFilter(field, value) {
    setPage(1);
    setFilters((f) => ({ ...f, [field]: value }));
  }

  function clearFilters() {
    setPage(1);
    setSearchInput('');
    setFilters(EMPTY_FILTERS);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await api.del(`/admin/enquiries/${id}`);
      setResult((r) => ({ ...r, data: r.data.filter((row) => row.id !== id) }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleStatusChange(id, status) {
    try {
      await api.put(`/admin/enquiries/${id}`, { status });
      setResult((r) => ({ ...r, data: r.data.map((row) => (row.id === id ? { ...row, status } : row)) }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleExport() {
    setExporting(true);
    setError(null);
    try {
      await api.download(`/admin/enquiries/export?${buildQuery(filters)}`, 'enquiries.csv');
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  }

  const totalPages = result ? Math.max(1, Math.ceil(result.total / result.limit)) : 1;
  const filtersActive = searchInput || filters.status || filters.from || filters.to;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '.8rem' }}>
        <h2 style={{ margin: 0 }}>Enquiries</h2>
        <button className="btn btn-accent btn-sm" onClick={handleExport} disabled={exporting}>
          {exporting ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      <div className="contact-form-card" style={{ marginBottom: '1.2rem', display: 'flex', flexWrap: 'wrap', gap: '.8rem', alignItems: 'flex-end' }}>
        <div className="form-group" style={{ flex: '2 1 220px', margin: 0 }}>
          <label>Search</label>
          <input
            type="text"
            placeholder="Name, clinic, email, phone, message…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="form-group" style={{ flex: '1 1 140px', margin: 0 }}>
          <label>Status</label>
          <select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)}>
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s[0].toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ flex: '1 1 140px', margin: 0 }}>
          <label>From</label>
          <input type="date" value={filters.from} onChange={(e) => updateFilter('from', e.target.value)} />
        </div>
        <div className="form-group" style={{ flex: '1 1 140px', margin: 0 }}>
          <label>To</label>
          <input type="date" value={filters.to} onChange={(e) => updateFilter('to', e.target.value)} />
        </div>
        {filtersActive && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear Filters</button>
        )}
      </div>

      {error && <p className="form-note" style={{ color: '#D9611E' }}>{error}</p>}

      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
              {['Date', 'Name', 'Clinic', 'Email', 'Phone', 'Subject', 'Message', 'Status', ''].map((h) => (
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
                  <select value={row.status} onChange={(e) => handleStatusChange(row.id, e.target.value)} style={{ textTransform: 'capitalize' }}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '.8rem 1rem' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(row.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {result && result.data.length === 0 && (
              <tr><td colSpan={9} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--mute)' }}>No enquiries found.</td></tr>
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
