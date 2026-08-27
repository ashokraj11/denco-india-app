import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { ArrowRightIcon } from './icons/UiIcons';
import Reveal from './Reveal';
import DecorativeLayer from './DecorativeLayer';

const SLIDE_INTERVAL = 6000;

// Falls back to a single static headline only if the admin has somehow
// deleted every hero_headlines row -- the hero should never render blank.
const FALLBACK_HEADLINES = [
  { id: 'fallback', line1: 'Precision Dental Restorations,', line2: 'Engineered for', accent: 'Perfect Fit.' }
];

export default function Hero() {
  const { settings } = useSiteSettings();
  const brochureUrl = resolveImageUrl(settings.brochureUrl);
  const [slides, setSlides] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [headlines, setHeadlines] = useState(FALLBACK_HEADLINES);

  useEffect(() => {
    api.get('/hero-slides').then(setSlides).catch(() => {});
  }, []);

  useEffect(() => {
    api.get('/hero-headlines').then((rows) => { if (rows?.length) setHeadlines(rows); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;
    const id = setInterval(() => {
      setSlideIndex((i) => (i + 1) % slides.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [slides.length]);

  const [index, setIndex] = useState(0);
  const [swapping, setSwapping] = useState(false);

  useEffect(() => {
    if (headlines.length < 2) return undefined;
    const id = setInterval(() => {
      setSwapping(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % headlines.length);
        setSwapping(false);
      }, 800);
    }, 3600);
    return () => clearInterval(id);
  }, [headlines.length]);

  const headline = headlines[index % headlines.length];

  return (
    <header className="hero" id="home">
      <div className="hero-slides" aria-hidden="true">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`hero-slide${i === slideIndex ? ' is-active' : ''}`}
            style={{ backgroundImage: `url(${resolveImageUrl(slide.imageUrl)})` }}
          />
        ))}
      </div>
      <div className="container">
        <div className="hero-grid">
          <Reveal as="div" className="hero-copy">
            <span className="eyebrow">{settings.heroEyebrow}</span>
            <h1 id="heroHeadline" className={`hero-headline-rotator${swapping ? ' is-swapping' : ''}`}>
              {headline.line1}<br />{headline.line2} <span className="accent">{headline.accent}</span>
            </h1>
            <p className="lead">{settings.heroLead}</p>
            <div className="hero-cta">
              <a href="#products" className="btn btn-primary">Explore Our Services
                <ArrowRightIcon />
              </a>
              {brochureUrl && (
                <a href={brochureUrl} className="btn btn-ghost" download target="_blank" rel="noopener noreferrer">Download Brochure</a>
              )}
            </div>
            <div className="trust-row">
              <div className="trust-badge">✓ ISO Certified Quality</div>
              <div className="trust-badge">✓ Advanced CAD/CAM</div>
              <div className="trust-badge">✓ Tamil Nadu Network</div>
            </div>
          </Reveal>
        </div>
      </div>
      <DecorativeLayer hostIndex={0} />
    </header>
  );
}
