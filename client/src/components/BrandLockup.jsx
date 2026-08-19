import { useEffect, useState } from 'react';
import { BrandMarkIcon } from './icons/UiIcons';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { resolveImageUrl } from '../utils/resolveImageUrl';

export default function BrandLockup() {
  const { settings, loading } = useSiteSettings();
  const logoSrc = resolveImageUrl(settings.logoUrl);
  const secondaryLogoSrc = resolveImageUrl(settings.secondaryLogoUrl);
  const [logoLoaded, setLogoLoaded] = useState(false);

  // The site name renders instantly once settings resolve, but the logo
  // image still needs to download -- reset and re-wait for it whenever the
  // logo changes, so the text appears together with the image, not before it.
  useEffect(() => { setLogoLoaded(false); }, [logoSrc]);

  const showText = !loading && (!logoSrc || logoLoaded);
  // Splits "DENCO INDIA" into its two words so each can carry its own
  // brand color -- falls back gracefully if the admin-set name is ever
  // just one word or something else entirely.
  const [nameFirst, ...nameRest] = (showText ? settings.siteName : '').split(' ');
  const nameLast = nameRest.join(' ');

  return (
    <a href="#home" className="brand-block">
      <span className="brand-name-row">
        <span className="brand-name">
          <span className="brand-name-primary">{nameFirst}</span>
          {nameLast && <> <span className="brand-name-secondary">{nameLast}</span></>}
        </span>
        <small>{showText ? settings.tagline : ''}</small>
      </span>
      <span className="brand-logo-row">
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
          <span className="brand-mark" style={{ background: 'transparent', boxShadow: 'none' }} aria-hidden="true" />
        ) : (
          <span className="brand-mark">
            <BrandMarkIcon />
          </span>
        )}
        {secondaryLogoSrc && (
          <img src={secondaryLogoSrc} alt="" className="brand-secondary-logo" />
        )}
      </span>
    </a>
  );
}
