import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useBlogAdminAuth } from '../context/BlogAdminAuthContext';
import { EyeIcon, EyeOffIcon } from '../components/icons/UiIcons';

export default function BlogAdminLogin() {
  const { login, isAuthenticated } = useBlogAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) return <Navigate to="/blog-admin" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(form);
      navigate('/blog-admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--mist)' }}>
      <form onSubmit={handleSubmit} className="contact-form-card" style={{ width: 'min(380px, 90vw)' }}>
        <h3 style={{ color: 'var(--navy)', fontSize: '1.15rem' }}>Blog Admin Login</h3>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input id="username" type="text" required value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              style={{ paddingRight: '2.6rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              style={{
                position: 'absolute', top: '50%', right: '.75rem', transform: 'translateY(-50%)',
                background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--mute)',
                display: 'flex', alignItems: 'center'
              }}
            >
              {showPassword ? <EyeOffIcon width={19} height={19} /> : <EyeIcon width={19} height={19} />}
            </button>
          </div>
        </div>
        {error && <p className="form-note" style={{ color: '#D9611E' }}>{error}</p>}
        <button type="submit" className="btn btn-accent" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
