import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { BlogAdminAuthProvider } from './context/BlogAdminAuthContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import WhatsAppFloat from './components/WhatsAppFloat';
import Home from './pages/Home';
import Career from './pages/Career';
import LegalPage from './pages/LegalPage';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import BlogAdminLogin from './pages/BlogAdminLogin';
import BlogAdminLayout from './pages/blog-admin/BlogAdminLayout';
import BlogAdminCategories from './pages/blog-admin/BlogAdminCategories';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminJobs from './pages/admin/AdminJobs';
import AdminJobApplications from './pages/admin/AdminJobApplications';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCertifications from './pages/admin/AdminCertifications';
import AdminServices from './pages/admin/AdminServices';
import AdminGallery from './pages/admin/AdminGallery';
import AdminHeroHeadlines from './pages/admin/AdminHeroHeadlines';
import AdminHeroSlides from './pages/admin/AdminHeroSlides';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminTrustBadges from './pages/admin/AdminTrustBadges';
import AdminOffices from './pages/admin/AdminOffices';
import AdminFaqs from './pages/admin/AdminFaqs';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLegalPages from './pages/admin/AdminLegalPages';
import AdminBackup from './pages/admin/AdminBackup';

// Lazy-loaded: RichTextEditor pulls in TipTap/ProseMirror, which is only
// ever needed by whoever is logged into the blog portal writing a post --
// bundling it into the main chunk would make every public site visitor
// download it for nothing.
const BlogAdminPosts = lazy(() => import('./pages/blog-admin/BlogAdminPosts'));

// React Router doesn't reset scroll position on navigation like a normal
// page load would -- without this, clicking a plain <Link> (e.g. "Careers"
// in the nav) while scrolled down keeps that same pixel offset on the new
// page, which can land you anywhere, including down in its footer. Hash
// navigation (e.g. HashLink to "/#services") is deliberately left alone
// here since Home's own effect handles scrolling to that section.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicWhatsAppFloat() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin') || pathname.startsWith('/blog-admin')) return null;
  return <WhatsAppFloat />;
}

export default function App() {
  return (
    <SiteSettingsProvider>
      <AdminAuthProvider>
        <BlogAdminAuthProvider>
          <ScrollToTop />
          <PublicWhatsAppFloat />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/careers" element={<Career />} />
            <Route path="/privacy-policy" element={<LegalPage slug="privacy-policy" />} />
            <Route path="/terms-conditions" element={<LegalPage slug="terms-conditions" />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="enquiries" replace />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="job-applications" element={<AdminJobApplications />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="certifications" element={<AdminCertifications />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="hero-headlines" element={<AdminHeroHeadlines />} />
              <Route path="hero-slides" element={<AdminHeroSlides />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="trust-badges" element={<AdminTrustBadges />} />
              <Route path="offices" element={<AdminOffices />} />
              <Route path="faqs" element={<AdminFaqs />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="legal-pages" element={<AdminLegalPages />} />
              <Route path="backup" element={<AdminBackup />} />
            </Route>
            <Route path="/blog-admin/login" element={<BlogAdminLogin />} />
            <Route path="/blog-admin" element={<BlogAdminLayout />}>
              <Route index element={<Navigate to="posts" replace />} />
              <Route path="posts" element={
                <Suspense fallback={<p style={{ color: 'var(--mute)' }}>Loading…</p>}>
                  <BlogAdminPosts />
                </Suspense>
              } />
              <Route path="categories" element={<BlogAdminCategories />} />
            </Route>
          </Routes>
        </BlogAdminAuthProvider>
      </AdminAuthProvider>
    </SiteSettingsProvider>
  );
}
