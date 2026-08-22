import { useEffect } from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useFetch } from '../hooks/useFetch';
import { resolveImageUrl } from '../utils/resolveImageUrl';

const SITE_URL = 'https://dencoindia.com/';

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html || '';
  return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim();
}

// Renders nothing -- keeps <head> meta tags and JSON-LD structured data in
// sync with live admin-managed settings, since index.html's static tags are
// only a fallback for crawlers that don't execute JavaScript. Mounted once,
// on the public Home page only (this is SEO for the public site, not admin).
export default function SeoMeta() {
  const { settings } = useSiteSettings();
  const { data: districts } = useFetch('/districts');
  const { data: faqs } = useFetch('/faqs');

  useEffect(() => {
    if (settings.metaTitle) document.title = settings.metaTitle;
    upsertMeta('name', 'description', settings.metaDescription);
    upsertMeta('property', 'og:title', settings.metaTitle);
    upsertMeta('property', 'og:description', settings.metaDescription);
    upsertMeta('name', 'twitter:title', settings.metaTitle);
    upsertMeta('name', 'twitter:description', settings.metaDescription);

    // Favicon preferred over the Logo for share-preview thumbnails -- the
    // logo is often a wide horizontal lockup that crops awkwardly in a
    // preview card, whereas the favicon is usually closer to square/mark-only.
    const shareImageSrc = resolveImageUrl(settings.faviconUrl) || resolveImageUrl(settings.logoUrl);
    if (shareImageSrc) {
      upsertMeta('property', 'og:image', shareImageSrc);
      upsertMeta('name', 'twitter:image', shareImageSrc);
    }
  }, [settings.metaTitle, settings.metaDescription, settings.faviconUrl, settings.logoUrl]);

  useEffect(() => {
    const sameAs = [settings.facebookUrl, settings.instagramUrl, settings.linkedinUrl, settings.youtubeUrl].filter(Boolean);
    const logoSrc = resolveImageUrl(settings.logoUrl) || undefined;

    upsertJsonLd('seo-org-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: settings.siteName || 'DENCO INDIA',
      description: settings.metaDescription || undefined,
      url: SITE_URL,
      logo: logoSrc,
      image: logoSrc,
      telephone: settings.contactPhone || undefined,
      email: settings.contactEmail || undefined,
      address: settings.contactAddress ? {
        '@type': 'PostalAddress',
        streetAddress: settings.contactAddress,
        addressRegion: 'Tamil Nadu',
        addressCountry: 'IN'
      } : undefined,
      areaServed: districts?.length
        ? districts.map((d) => ({ '@type': 'AdministrativeArea', name: d.name }))
        : [{ '@type': 'State', name: 'Tamil Nadu' }, { '@type': 'AdministrativeArea', name: 'Puducherry' }],
      sameAs: sameAs.length ? sameAs : undefined
    });
  }, [settings, districts]);

  useEffect(() => {
    if (!faqs?.length) return;
    upsertJsonLd('seo-faq-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: stripHtml(f.answerHtml) }
      }))
    });
  }, [faqs]);

  return null;
}
