import { useEffect, useRef, useState } from 'react';
import { BrandMarkIcon } from './icons/UiIcons';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { resolveImageUrl } from '../utils/resolveImageUrl';

export default function BrandLockup() {
  const { settings } = useSiteSettings();
  const logoSrc = resolveImageUrl(settings.logoUrl);
  const secondaryLogoSrc = resolveImageUrl(settings.secondaryLogoUrl);
  const nameRef = useRef(null);
  const [nameWidth, setNameWidth] = useState(null);

  useEffect(() => {
    const el = nameRef.current;
    if (!el) return undefined;
    const sync = () => setNameWidth(el.offsetWidth);
    sync();
    window.addEventListener('resize', sync);
    const ro = window.ResizeObserver ? new ResizeObserver(sync) : null;
    ro?.observe(el);
    return () => {
      window.removeEventListener('resize', sync);
      ro?.disconnect();
    };
  }, [settings.siteName]);

  return (
    <a href="#home" className="brand">
      <span className="brand-mark">
        {logoSrc ? <img src={logoSrc} alt={settings.siteName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} /> : <BrandMarkIcon />}
      </span>
      <span className="brand-text-col">
        <span><span ref={nameRef}>{settings.siteName}</span> <small>{settings.tagline}</small></span>
        {secondaryLogoSrc && (
          <img
            src={secondaryLogoSrc}
            alt=""
            className="brand-secondary-logo"
            style={nameWidth ? { width: `${nameWidth}px` } : undefined}
          />
        )}
      </span>
    </a>
  );
}
