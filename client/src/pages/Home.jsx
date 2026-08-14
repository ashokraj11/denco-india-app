import { useEffect } from 'react';
import { useSmoothAnchorScroll } from '../hooks/useSmoothAnchorScroll';
import { useSiteSettings } from '../context/SiteSettingsContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Products from '../components/Products';
import TrustBadges from '../components/TrustBadges';
import About from '../components/About';
import Certifications from '../components/Certifications';
import TechnologyGallery from '../components/TechnologyGallery';
import ServiceNetwork from '../components/ServiceNetwork';
import Contact from '../components/Contact';
import Testimonials from '../components/Testimonials';
import Faq from '../components/Faq';
import Footer from '../components/Footer';

export default function Home() {
  useSmoothAnchorScroll();
  const { settings } = useSiteSettings();

  useEffect(() => {
    if (settings.metaTitle) document.title = settings.metaTitle;
  }, [settings.metaTitle]);

  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Products />
      <TrustBadges />
      <About />
      <Certifications />
      <TechnologyGallery />
      <ServiceNetwork />
      <Contact />
      <Testimonials />
      <Faq />
      <Footer />
    </>
  );
}
