import { useState } from 'react';
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BrandMarkIcon, ChevronDownIcon } from '../../components/icons/UiIcons';

const NAV_GROUPS = [
  { label: 'Overview', items: [{ to: 'enquiries', label: 'Enquiries' }] },
  { label: 'Careers', items: [
    { to: 'jobs', label: 'Job Postings' },
    { to: 'job-applications', label: 'Job Applications' }
  ] },
  { label: 'Content', items: [
    { to: 'hero-headlines', label: 'Hero Headlines' },
    { to: 'hero-slides', label: 'Hero Slider' },
    { to: 'trust-badges', label: 'Trust Badges' },
    { to: 'gallery', label: 'Gallery' },
    { to: 'testimonials', label: 'Testimonials' },
    { to: 'faqs', label: 'FAQs' }
  ] },
  { label: 'Catalog', items: [
    { to: 'products', label: 'Products' },
    { to: 'categories', label: 'Categories' },
    { to: 'certifications', label: 'Certifications' },
    { to: 'services', label: 'Services' }
  ] },
  { label: 'Network', items: [{ to: 'offices', label: 'Area Managers' }] },
  { label: 'Settings', items: [
    { to: 'settings', label: 'Site Settings' },
    { to: 'legal-pages', label: 'Legal Pages' },
    { to: 'backup', label: 'Backup & Restore' }
  ] }
];

export default function AdminLayout() {
  const { isAuthenticated, username, logout } = useAdminAuth();
  const location = useLocation();
  const activeGroupLabel = NAV_GROUPS.find((g) => g.items.some((i) => location.pathname.includes(`/admin/${i.to}`)))?.label;
  const [openGroups, setOpenGroups] = useState(() => new Set(activeGroupLabel ? [activeGroupLabel] : []));

  function toggleGroup(label) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }

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
        <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.6)' }}>
          <div style={{ marginBottom: '.6rem' }}>Signed in as {username || 'admin'}</div>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={logout}>Log Out</button>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '.15rem', overflowY: 'auto' }}>
          {NAV_GROUPS.map((group) => {
            const isSingle = group.items.length === 1;
            const isOpen = isSingle || openGroups.has(group.label);
            return (
              <div key={group.label}>
                {isSingle ? (
                  <NavLink
                    to={group.items[0].to}
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
                    {group.items[0].label}
                  </NavLink>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.label)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        width: '100%', padding: '.6rem .8rem', background: 'transparent', border: 'none',
                        color: 'rgba(255,255,255,.55)', fontWeight: 700, fontSize: '.72rem',
                        letterSpacing: '.06em', textTransform: 'uppercase', cursor: 'pointer'
                      }}
                    >
                      {group.label}
                      <span style={{ display: 'flex', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease' }}>
                        <ChevronDownIcon style={{ width: 13, height: 13 }} />
                      </span>
                    </button>
                    {isOpen && group.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        style={({ isActive }) => ({
                          display: 'block',
                          padding: '.6rem .8rem .6rem 1.3rem',
                          borderRadius: 8,
                          color: isActive ? '#fff' : 'rgba(255,255,255,.7)',
                          background: isActive ? 'rgba(255,255,255,.12)' : 'transparent',
                          fontWeight: 600,
                          fontSize: '.85rem'
                        })}
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 'clamp(1.2rem, 3vw, 2.4rem)', overflowX: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
