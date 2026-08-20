import { Link } from 'react-router-dom';
import { LinkedInIcon, InstagramIcon, FacebookIcon, YoutubeIcon, LocationPinIcon, PhoneIcon, MailIcon } from './icons/UiIcons';
import DecorativeLayer from './DecorativeLayer';
import BrandLockup from './BrandLockup';
import HashLink from './HashLink';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer style={{ position: 'relative' }}>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <BrandLockup />
            <p>A scientific dental laboratory delivering precision CAD/CAM prosthetics and digital dentistry solutions to dentists, clinics and hospitals across Tamil Nadu.</p>
            <div className="footer-social">
              {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FacebookIcon /></a>}
              {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>}
              {settings.linkedinUrl && <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>}
              {settings.youtubeUrl && <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><YoutubeIcon /></a>}
            </div>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li><HashLink href="#about">About Us</HashLink></li>
              <li><HashLink href="#about">Vision &amp; Mission</HashLink></li>
              <li><HashLink href="#certs">Certifications</HashLink></li>
              <li><HashLink href="#technology">Gallery</HashLink></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Our Services</h5>
            <ul>
              <li><HashLink href="#cat-fixed">Crown &amp; Bridge</HashLink></li>
              <li><HashLink href="#cat-digital">CAD/CAM Digital Dentistry</HashLink></li>
              <li><HashLink href="#cat-fixed">Zirconia Restorations</HashLink></li>
              <li><HashLink href="#cat-implant">Implant Prosthetics</HashLink></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Information</h5>
            <ul>
              <li><HashLink href="#certs">Quality Assurance</HashLink></li>
              <li><HashLink href="#service-network">Service Network</HashLink></li>
              <li><HashLink href="#faq">FAQs</HashLink></li>
              <li><a href="#">Download Catalogue</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Contact Us</h5>
            <ul className="footer-contact">
              <li><LocationPinIcon /> {settings.contactAddress}</li>
              <li><PhoneIcon /> {settings.contactPhone}</li>
              <li><MailIcon /> {settings.contactEmail}</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {settings.siteName} {settings.tagline}. All Rights Reserved.</span>
          <div style={{ display: 'flex', gap: '1.4rem' }}>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-conditions">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
      <DecorativeLayer hostIndex={10} />
    </footer>
  );
}
