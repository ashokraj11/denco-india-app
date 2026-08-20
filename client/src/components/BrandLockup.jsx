import { BrandMarkIcon } from './icons/UiIcons';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { resolveImageUrl } from '../utils/resolveImageUrl';

// A single uploaded logo image (Site Settings -> Logo) replaces the old
// composite lockup (separate name/tagline text, main + secondary logo).
export default function BrandLockup() {
  const { settings, loading } = useSiteSettings();
  const logoSrc = resolveImageUrl(settings.logoUrl);
  // min() against a vw-based cap so an admin-set desktop-sized height
  // doesn't blow out the compact mobile header -- it shrinks with the
  // viewport the same way the default clamp() sizing does.
  const logoStyle = settings.logoHeight ? { height: `min(${settings.logoHeight}px, 16vw)` } : undefined;

  return (
    <a href="#home" className="brand-block">
      {logoSrc ? (
        <img src={logoSrc} alt={settings.siteName} className="brand-logo-img" style={logoStyle} />
      ) : !loading && (
        <span className="brand-mark">
          <BrandMarkIcon />
        </span>
      )}
    </a>
  );
}
