import { useEffect, useRef, useState } from 'react';
import { ArrowRightIcon } from './icons/UiIcons';
import BrandLockup from './BrandLockup';

const LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About Us' },
  { href: '#services', label: 'Services' },
  { href: '#products', label: 'Products' },
  { href: '#technology', label: 'Technology' },
  { href: '#service-network', label: 'Service Network' },
  { href: '#certs', label: 'Quality' },
  { href: '#contact', label: 'Contact' }
];

export default function Navbar() {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('#home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;
    const sync = () => document.documentElement.style.setProperty('--nav-h', `${nav.offsetHeight}px`);
    sync();
    window.addEventListener('resize', sync);
    const ro = window.ResizeObserver ? new ResizeObserver(sync) : null;
    ro?.observe(nav);
    return () => {
      window.removeEventListener('resize', sync);
      ro?.disconnect();
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id], header[id]');
    if (!sections.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHref(`#${entry.target.getAttribute('id')}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('nav-open', mobileOpen);
  }, [mobileOpen]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 960) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="mainNav" ref={navRef}>
        <div className="container nav-inner">
          <BrandLockup />

          <button
            className={`nav-toggle${mobileOpen ? ' active' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="navLinks"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="nav-toggle-bar"></span>
            <span className="nav-toggle-bar"></span>
            <span className="nav-toggle-bar"></span>
          </button>

          <ul className={`nav-links${mobileOpen ? ' open' : ''}`} id="navLinks">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={activeHref === link.href ? 'active' : ''}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" data-cta onClick={() => setMobileOpen(false)}>
                <span className="btn btn-primary btn-sm">Book a Lab Pickup</span>
              </a>
            </li>
          </ul>

          <a href="#contact" className="btn btn-primary btn-sm nav-desktop-cta">
            Book a Lab Pickup
            <ArrowRightIcon />
          </a>
        </div>
      </nav>
      <div className={`nav-overlay${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(false)}></div>
    </>
  );
}
