import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BrandMarkIcon } from '../../components/icons/UiIcons';

const NAV_ITEMS = [
  { to: 'enquiries', label: 'Enquiries' },
  { to: 'products', label: 'Products' },
  { to: 'categories', label: 'Categories' },
  { to: 'certifications', label: 'Certifications' },
  { to: 'services', label: 'Services' },
  { to: 'gallery', label: 'Technology Gallery' },
  { to: 'offices', label: 'Area Managers' },
  { to: 'faqs', label: 'FAQs' },
  { to: 'settings', label: 'Site Settings' },
  { to: 'backup', label: 'Backup & Restore' }
];

export default function AdminLayout() {
  const { isAuthenticated, username, logout } = useAdminAuth();

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--mist)' }}>
      <aside style={{
        width: 220, flexShrink: 0, background: 'var(--grad-navy)', color: '#fff',
        padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', padding: '0 .4rem' }}>
          <span className="brand-mark" style={{ width: 34, height: 34 }}><BrandMarkIcon /></span>
          <span style={{ fontFamily: 'var(--f-display)', fontWeight: 800 }}>Admin</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '.15rem' }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                padding: '.7rem .9rem',
                borderRadius: 10,
                color: isActive ? '#fff' : 'rgba(255,255,255,.7)',
                background: isActive ? 'rgba(255,255,255,.12)' : 'transparent',
                fontWeight: 600,
                fontSize: '.9rem'
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', fontSize: '.8rem', color: 'rgba(255,255,255,.6)' }}>
          <div style={{ marginBottom: '.6rem' }}>Signed in as {username || 'admin'}</div>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={logout}>Log Out</button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: 'clamp(1.2rem, 3vw, 2.4rem)', overflowX: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
