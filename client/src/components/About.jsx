import Reveal from './Reveal';
import DecorativeLayer from './DecorativeLayer';

export default function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-grid">
          <Reveal as="div" className="about-copy">
            <span className="eyebrow">Who We Are</span>
            <h2>Precision, Backed by Science and Skilled Craftsmanship</h2>
            <p>DENCO INDIA specializes in the design and manufacture of high-quality dental prosthetics using advanced digital technologies. We partner with dentists, clinics and hospitals to deliver reliable, aesthetically superior, and clinically accurate restorations.</p>
            <p>By combining experienced dental technicians, internationally certified materials and state-of-the-art CAD/CAM technology, we consistently meet global quality standards while ensuring fast turnaround and exceptional customer satisfaction.</p>
            <a href="#certs" className="btn btn-accent" style={{ marginTop: '1.6rem' }}>Our Certifications</a>
          </Reveal>
          <Reveal as="div" className="about-media" delay={1}>
            <img src="https://images.unsplash.com/photo-1468493858157-0da44aaf1d13?q=80&w=1200&auto=format&fit=crop" alt="Hand holding a precision dental restoration for close inspection" />
          </Reveal>
        </div>
      </div>
      <DecorativeLayer hostIndex={4} />
    </section>
  );
}
