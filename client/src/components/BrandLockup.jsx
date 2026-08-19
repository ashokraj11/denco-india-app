import { useEffect, useRef, useState } from 'react';
import { BrandMarkIcon } from './icons/UiIcons';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { resolveImageUrl } from '../utils/resolveImageUrl';

export default function BrandLockup() {
  const { settings, loading } = useSiteSettings();
  const logoSrc = resolveImageUrl(settings.logoUrl);
  const secondaryLogoSrc = resolveImageUrl(settings.secondaryLogoUrl);
  const nameRef = useRef(null);
  const [nameWidth, setNameWidth] = useState(null);
  const [logoLoaded, setLogoLoaded] = useState(false);

  // The site name renders instantly once settings resolve, but the logo
  // image still needs to download -- reset and re-wait for it whenever the
  // logo changes, so the text appears together with the image, not before it.
  useEffect(() => { setLogoLoaded(false); }, [logoSrc]);

  const showText = !loading && (!logoSrc || logoLoaded);

  useEffect(() => {
    const nameEl = nameRef.current;
    if (!nameEl) return undefined;
    const sync = () => setNameWidth(nameEl.offsetWidth);
    sync();
    window.addEventListener('resize', sync);
    const ro = window.ResizeObserver ? new ResizeObserver(sync) : null;
    ro?.observe(nameEl);
    return () => {
      window.removeEventListener('resize', sync);
      ro?.disconnect();
    };
  }, [settings.siteName, secondaryLogoSrc]);

  return (
    <a href="#home" className={`brand${secondaryLogoSrc ? ' brand--compact' : ''}`}>
      {logoSrc ? (
        <img
          src={logoSrc}
          alt={settings.siteName}
          className="brand-mark-img"
          style={{ visibility: logoLoaded ? 'visible' : 'hidden' }}
          onLoad={() => setLogoLoaded(true)}
          onError={() => setLogoLoaded(true)}
        />
      ) : loading ? (
        <span
          className="brand-mark"
          style={{ background: 'transparent', boxShadow: 'none' }}
          aria-hidden="true"
        />
      ) : (
        <span className="brand-mark">
          <BrandMarkIcon />
        </span>
      )}
      <span className="brand-text-col">
        <span><span className="brand-name" ref={nameRef}>{showText ? settings.siteName : ''}</span> <small>{showText ? settings.tagline : ''}</small></span>
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
