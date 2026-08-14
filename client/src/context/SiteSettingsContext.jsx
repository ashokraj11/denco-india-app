import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';

const DEFAULTS = {
  siteName: 'DENCO',
  tagline: 'INDIA',
  logoUrl: null,
  secondaryLogoUrl: null,
  brochureUrl: null,
  testimonialsVisible: true,
  metaTitle: 'DENCO INDIA | Scientific Dental Laboratory & Digital Dentistry',
  metaDescription: '',
  contactPhone: '+91 97917 11182',
  contactEmail: 'info@dencoindia.com',
  contactAddress: 'Serving dental professionals across Tamil Nadu & Puducherry, India',
  whatsappNumber: '917010767919'
};

// Settings rarely change, but every page load otherwise has to wait on a
// network round trip before showing the real logo/name -- cache the last
// successful fetch so returning visitors see it instantly, then silently
// refresh in the background to pick up any admin changes.
const CACHE_KEY = 'denco_site_settings_cache';

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors (private browsing, quota, etc.) -- caching is
    // an optimization, not something the app depends on.
  }
}

const SiteSettingsContext = createContext({ settings: DEFAULTS, loading: true, reload: () => {} });

export function SiteSettingsProvider({ children }) {
  const [cached] = useState(readCache);
  const [settings, setSettings] = useState(cached ? { ...DEFAULTS, ...cached } : DEFAULTS);
  const [loading, setLoading] = useState(!cached);

  function load() {
    api.get('/settings')
      .then((data) => {
        if (data) {
          setSettings({ ...DEFAULTS, ...data });
          writeCache(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, reload: load }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
