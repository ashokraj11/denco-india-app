import { BrandMarkIcon, LinkedInIcon, InstagramIcon, FacebookIcon, LocationPinIcon, PhoneIcon, MailIcon } from './icons/UiIcons';
import DecorativeLayer from './DecorativeLayer';

export default function Footer() {
  return (
    <footer style={{ position: 'relative' }}>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#home" className="brand">
              <span className="brand-mark"><BrandMarkIcon /></span>
              <span>DENCO <small>INDIA</small></span>
            </a>
            <p>A scientific dental laboratory delivering precision CAD/CAM prosthetics and digital dentistry solutions to dentists, clinics and hospitals across Tamil Nadu.</p>
            <div className="footer-social">
              <a href="#" aria-label="LinkedIn"><LinkedInIcon /></a>
              <a href="#" aria-label="Instagram"><InstagramIcon /></a>
              <a href="#" aria-label="Facebook"><FacebookIcon /></a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#about">Vision &amp; Mission</a></li>
              <li><a href="#certs">Certifications</a></li>
              <li><a href="#technology">Technology</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Our Services</h5>
            <ul>
              <li><a href="#cat-fixed">Crown &amp; Bridge</a></li>
              <li><a href="#cat-digital">CAD/CAM Digital Dentistry</a></li>
              <li><a href="#cat-fixed">Zirconia Restorations</a></li>
              <li><a href="#cat-implant">Implant Prosthetics</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Information</h5>
            <ul>
              <li><a href="#certs">Quality Assurance</a></li>
              <li><a href="#service-network">Service Network</a></li>
              <li><a href="#faq">FAQs</a></li>
              <li><a href="#">Download Catalogue</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Contact Us</h5>
            <ul className="footer-contact">
              <li><LocationPinIcon /> Serving dental professionals across Tamil Nadu, India</li>
              <li><PhoneIcon /> +91 XX XXXX XXXX</li>
              <li><MailIcon /> info@dencoindia.com</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} DENCO INDIA. All Rights Reserved.</span>
          <div style={{ display: 'flex', gap: '1.4rem' }}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
      <DecorativeLayer hostIndex={10} dark />
    </footer>
  );
}
