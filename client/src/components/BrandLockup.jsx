import { BrandMarkIcon } from './icons/UiIcons';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { resolveImageUrl } from '../utils/resolveImageUrl';

// A single uploaded logo image (Site Settings -> Logo) replaces the old
// composite lockup (separate name/tagline text, main + secondary logo).
export default function BrandLockup() {
  const { settings, loading } = useSiteSettings();
  const logoSrc = resolveImageUrl(settings.logoUrl);

  return (
    <a href="#home" className="brand-block">
      {logoSrc ? (
        <img src={logoSrc} alt={settings.siteName} className="brand-logo-img" />
      ) : !loading && (
        <span className="brand-mark">
          <BrandMarkIcon />
        </span>
      )}
    </a>
  );
}
