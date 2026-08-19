import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import Home from './pages/Home';
import Career from './pages/Career';
import LegalPage from './pages/LegalPage';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminJobs from './pages/admin/AdminJobs';
import AdminJobApplications from './pages/admin/AdminJobApplications';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCertifications from './pages/admin/AdminCertifications';
import AdminServices from './pages/admin/AdminServices';
import AdminGallery from './pages/admin/AdminGallery';
import AdminHeroSlides from './pages/admin/AdminHeroSlides';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminTrustBadges from './pages/admin/AdminTrustBadges';
import AdminOffices from './pages/admin/AdminOffices';
import AdminFaqs from './pages/admin/AdminFaqs';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLegalPages from './pages/admin/AdminLegalPages';
import AdminBackup from './pages/admin/AdminBackup';

export default function App() {
  return (
    <SiteSettingsProvider>
      <AdminAuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/careers" element={<Career />} />
          <Route path="/privacy-policy" element={<LegalPage slug="privacy-policy" />} />
          <Route path="/terms-conditions" element={<LegalPage slug="terms-conditions" />} />
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
            <Route path="hero-slides" element={<AdminHeroSlides />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="trust-badges" element={<AdminTrustBadges />} />
            <Route path="offices" element={<AdminOffices />} />
            <Route path="faqs" element={<AdminFaqs />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="legal-pages" element={<AdminLegalPages />} />
            <Route path="backup" element={<AdminBackup />} />
          </Route>
        </Routes>
      </AdminAuthProvider>
    </SiteSettingsProvider>
  );
}
