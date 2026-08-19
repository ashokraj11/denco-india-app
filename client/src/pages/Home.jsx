import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSmoothAnchorScroll } from '../hooks/useSmoothAnchorScroll';
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
import SeoMeta from '../components/SeoMeta';

export default function Home() {
  useSmoothAnchorScroll();
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash || hash.length <= 1) return undefined;
    // Arriving here from another page (e.g. a HashLink from /careers) --
    // give the sections a tick to render before measuring their position.
    const t = setTimeout(() => {
      const target = document.querySelector(hash);
      if (!target) return;
      const y = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }, 60);
    return () => clearTimeout(t);
  }, [hash]);

  return (
    <>
      <SeoMeta />
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
