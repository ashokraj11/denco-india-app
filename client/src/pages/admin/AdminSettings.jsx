import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import ImageUploadField from '../../components/admin/ImageUploadField';
import DocumentUploadField from '../../components/admin/DocumentUploadField';
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
        logo_height: form.logoHeight || null,
        secondary_logo_url: form.secondaryLogoUrl,
        brochure_url: form.brochureUrl,
        meta_title: form.metaTitle,
        meta_description: form.metaDescription,
        contact_phone: form.contactPhone,
        contact_email: form.contactEmail,
        contact_address: form.contactAddress,
        whatsapp_number: form.whatsappNumber,
        facebook_url: form.facebookUrl,
        instagram_url: form.instagramUrl,
        linkedin_url: form.linkedinUrl,
        youtube_url: form.youtubeUrl
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
        <p className="form-note" style={{ margin: '-.6rem 0 0' }}>
          Not shown in the menu bar/footer (that's just the logo image below) -- used for the browser tab title, SEO, and the footer copyright line.
        </p>

        <ImageUploadField label="Logo (single image, shown in the menu bar and footer)" value={form.logoUrl} onChange={(url) => update('logoUrl', url)} />

        <div className="form-group">
          <label>Logo Height (px)</label>
          <input
            type="number"
            min="24"
            max="200"
            placeholder="Default (auto-sized)"
            value={form.logoHeight ?? ''}
            onChange={(e) => update('logoHeight', e.target.value ? Number(e.target.value) : null)}
          />
          <span style={{ fontSize: '.78rem', color: 'var(--mute)' }}>Leave blank to use the default responsive size. Applies in both the menu bar and the footer.</span>
        </div>

        <DocumentUploadField label="Brochure (PDF, linked from the homepage's Download Brochure button)" value={form.brochureUrl} onChange={(url) => update('brochureUrl', url)} />

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
          <input type="text" placeholder="919876543210" value={form.whatsappNumber || ''} onChange={(e) => update('whatsappNumber', e.target.value)} />
        </div>

        <h3 style={{ color: 'var(--navy)', fontSize: '1.05rem', margin: '.5rem 0 0' }}>Social Media Links</h3>
        <p className="form-note" style={{ margin: 0 }}>
          Leave any of these blank to hide that icon in the footer and contact section.
        </p>
        <div className="form-row">
          <div className="form-group">
            <label>Facebook URL</label>
            <input type="url" placeholder="https://facebook.com/yourpage" value={form.facebookUrl || ''} onChange={(e) => update('facebookUrl', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Instagram URL</label>
            <input type="url" placeholder="https://instagram.com/yourpage" value={form.instagramUrl || ''} onChange={(e) => update('instagramUrl', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>LinkedIn URL</label>
            <input type="url" placeholder="https://linkedin.com/company/yourpage" value={form.linkedinUrl || ''} onChange={(e) => update('linkedinUrl', e.target.value)} />
          </div>
          <div className="form-group">
            <label>YouTube URL</label>
            <input type="url" placeholder="https://youtube.com/@yourchannel" value={form.youtubeUrl || ''} onChange={(e) => update('youtubeUrl', e.target.value)} />
          </div>
        </div>

        {error && <p className="form-note" style={{ color: '#D9611E' }}>{error}</p>}
        {saved && <p className="form-note">Saved.</p>}
        <button type="submit" className="btn btn-accent btn-sm" disabled={saving}>{saving ? 'Saving…' : 'Save Settings'}</button>
      </form>
    </div>
  );
}
