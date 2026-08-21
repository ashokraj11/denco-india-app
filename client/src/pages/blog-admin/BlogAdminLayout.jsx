import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { useBlogAdminAuth } from '../../context/BlogAdminAuthContext';
import { BrandMarkIcon } from '../../components/icons/UiIcons';

const NAV_ITEMS = [
  { to: 'posts', label: 'Posts' },
  { to: 'categories', label: 'Categories' }
];

export default function BlogAdminLayout() {
  const { isAuthenticated, username, logout } = useBlogAdminAuth();

  if (!isAuthenticated) return <Navigate to="/blog-admin/login" replace />;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--mist)' }}>
      <aside style={{
        width: 220, flexShrink: 0, background: 'var(--grad-navy)', color: '#fff',
        padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', padding: '0 .4rem' }}>
          <span className="brand-mark" style={{ width: 34, height: 34 }}><BrandMarkIcon /></span>
          <span style={{ fontFamily: 'var(--f-display)', fontWeight: 800 }}>Blog Admin</span>
        </div>
        <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.6)' }}>
          <div style={{ marginBottom: '.6rem' }}>Signed in as {username || 'blog-admin'}</div>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={logout}>Log Out</button>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '.15rem', overflowY: 'auto' }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'block',
                padding: '.6rem .8rem',
                borderRadius: 8,
                color: isActive ? '#fff' : 'rgba(255,255,255,.75)',
                background: isActive ? 'rgba(255,255,255,.12)' : 'transparent',
                fontWeight: 700,
                fontSize: '.85rem'
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 'clamp(1.2rem, 3vw, 2.4rem)', overflowX: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
