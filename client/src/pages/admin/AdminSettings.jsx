import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import ImageUploadField from '../../components/admin/ImageUploadField';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export default function AdminSettings() {
  const { settings, loading, reload } = useSiteSettings();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading) setForm(settings);
  }, [loading, settings]);

  function update(field, value) {
    setForm((s) => ({ ...s, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.put('/admin/settings', {
        site_name: form.siteName,
        tagline: form.tagline,
        logo_url: form.logoUrl,
        meta_title: form.metaTitle,
        meta_description: form.metaDescription,
        contact_phone: form.contactPhone,
        contact_email: form.contactEmail,
        contact_address: form.contactAddress,
        whatsapp_number: form.whatsappNumber
      });
      reload();
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!form) return <p>Loading…</p>;

  return (
    <div>
      <h2 style={{ margin: '0 0 1.2rem' }}>Site Settings</h2>

      <form onSubmit={handleSubmit} className="contact-form-card" style={{ maxWidth: 560 }}>
        <div className="form-row">
          <div className="form-group">
            <label>Site Name</label>
            <input type="text" value={form.siteName || ''} onChange={(e) => update('siteName', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Tagline</label>
            <input type="text" value={form.tagline || ''} onChange={(e) => update('tagline', e.target.value)} />
          </div>
        </div>

        <ImageUploadField label="Logo" value={form.logoUrl} onChange={(url) => update('logoUrl', url)} />

        <div className="form-group">
          <label>Browser Tab Title</label>
          <input type="text" value={form.metaTitle || ''} onChange={(e) => update('metaTitle', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Meta Description</label>
          <textarea rows={2} value={form.metaDescription || ''} onChange={(e) => update('metaDescription', e.target.value)} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Contact Phone</label>
            <input type="text" value={form.contactPhone || ''} onChange={(e) => update('contactPhone', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Contact Email</label>
            <input type="email" value={form.contactEmail || ''} onChange={(e) => update('contactEmail', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label>Contact Address</label>
          <input type="text" value={form.contactAddress || ''} onChange={(e) => update('contactAddress', e.target.value)} />
        </div>
        <div className="form-group">
          <label>WhatsApp Number (digits only, with country code)</label>
          <input type="text" placeholder="917010767919" value={form.whatsappNumber || ''} onChange={(e) => update('whatsappNumber', e.target.value)} />
        </div>

        {error && <p className="form-note" style={{ color: '#D9611E' }}>{error}</p>}
        {saved && <p className="form-note">Saved.</p>}
        <button type="submit" className="btn btn-accent btn-sm" disabled={saving}>{saving ? 'Saving…' : 'Save Settings'}</button>
      </form>
    </div>
  );
}
