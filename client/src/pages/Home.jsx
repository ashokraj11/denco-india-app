import { useSmoothAnchorScroll } from '../hooks/useSmoothAnchorScroll';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Products from '../components/Products';
import StatsMarquee from '../components/StatsMarquee';
import About from '../components/About';
import Certifications from '../components/Certifications';
import TechnologyGallery from '../components/TechnologyGallery';
import ServiceNetwork from '../components/ServiceNetwork';
import Contact from '../components/Contact';
import Faq from '../components/Faq';
import Footer from '../components/Footer';

export default function Home() {
  useSmoothAnchorScroll();

  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Products />
      <StatsMarquee />
      <About />
      <Certifications />
      <TechnologyGallery />
      <ServiceNetwork />
      <Contact />
      <Faq />
      <Footer />
    </>
  );
}
