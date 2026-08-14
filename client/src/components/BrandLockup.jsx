import { useEffect, useRef, useState } from 'react';
import { BrandMarkIcon } from './icons/UiIcons';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { resolveImageUrl } from '../utils/resolveImageUrl';

export default function BrandLockup() {
  const { settings, loading } = useSiteSettings();
  const logoSrc = resolveImageUrl(settings.logoUrl);
  const secondaryLogoSrc = resolveImageUrl(settings.secondaryLogoUrl);
  const nameRef = useRef(null);
  const stackRef = useRef(null);
  const [nameWidth, setNameWidth] = useState(null);
  const [stackHeight, setStackHeight] = useState(null);

  useEffect(() => {
    const nameEl = nameRef.current;
    const stackEl = stackRef.current;
    if (!nameEl || !stackEl) return undefined;
    const sync = () => {
      setNameWidth(nameEl.offsetWidth);
      setStackHeight(stackEl.offsetHeight);
    };
    sync();
    window.addEventListener('resize', sync);
    const ro = window.ResizeObserver ? new ResizeObserver(sync) : null;
    ro?.observe(nameEl);
    ro?.observe(stackEl);
    return () => {
      window.removeEventListener('resize', sync);
      ro?.disconnect();
    };
  }, [settings.siteName, secondaryLogoSrc]);

  const markHeight = secondaryLogoSrc && stackHeight ? `${stackHeight}px` : undefined;

  return (
    <a href="#home" className={`brand${secondaryLogoSrc ? ' brand--compact' : ''}`}>
      {logoSrc ? (
        <img
          src={logoSrc}
          alt={settings.siteName}
          className="brand-mark-img"
          style={markHeight ? { height: markHeight } : undefined}
        />
      ) : loading ? (
        <span
          className="brand-mark"
          style={{ background: 'transparent', boxShadow: 'none', ...(markHeight ? { width: markHeight, height: markHeight } : null) }}
          aria-hidden="true"
        />
      ) : (
        <span className="brand-mark" style={markHeight ? { width: markHeight, height: markHeight } : undefined}>
          <BrandMarkIcon />
        </span>
      )}
      <span className="brand-text-col" ref={stackRef}>
        <span><span ref={nameRef}>{loading ? '' : settings.siteName}</span> <small>{loading ? '' : settings.tagline}</small></span>
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
