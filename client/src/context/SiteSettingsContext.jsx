import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';

const DEFAULTS = {
  siteName: 'DENCO',
  tagline: 'INDIA',
  logoUrl: null,
  metaTitle: 'DENCO INDIA | Scientific Dental Laboratory & Digital Dentistry',
  metaDescription: '',
  contactPhone: '+91 97917 11182',
  contactEmail: 'info@dencoindia.com',
  contactAddress: 'Serving dental professionals across Tamil Nadu & Puducherry, India',
  whatsappNumber: '917010767919'
};

const SiteSettingsContext = createContext({ settings: DEFAULTS, loading: true, reload: () => {} });

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api.get('/settings')
      .then((data) => { if (data) setSettings({ ...DEFAULTS, ...data }); })
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
