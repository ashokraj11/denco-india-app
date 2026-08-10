import { useState } from 'react';
import { api } from '../api/client';
import { LocationPinIcon, PhoneIcon, MailIcon, ArrowRightIcon, CheckIcon, LinkedInIcon, InstagramIcon, FacebookIcon } from './icons/UiIcons';
import ContentIcon from './icons/ContentIcon';
import Reveal from './Reveal';
import DecorativeLayer from './DecorativeLayer';
import { useSiteSettings } from '../context/SiteSettingsContext';

const FALLBACK_WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '917010767919';

const EMPTY_FORM = { name: '', clinic: '', email: '', phone: '', subject: 'General Enquiry', message: '', consent: false };

export default function Contact() {
  const { settings } = useSiteSettings();
  const whatsappNumber = settings.whatsappNumber || FALLBACK_WHATSAPP_NUMBER;
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim() || !form.consent) {
      e.target.reportValidity?.();
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/enquiries', {
        name: form.name.trim(),
        clinic: form.clinic.trim() || undefined,
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject,
        message: form.message.trim()
      });

      const lines = [
        '*New Enquiry — DENCO INDIA Website*',
        '',
        `*Name:* ${form.name.trim()}`,
        form.clinic.trim() ? `*Clinic/Hospital:* ${form.clinic.trim()}` : null,
        `*Email:* ${form.email.trim()}`,
        `*Phone:* ${form.phone.trim()}`,
        `*Subject:* ${form.subject}`,
        '',
        '*Message:*',
        form.message.trim()
      ].filter(Boolean);
      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
      window.open(waUrl, '_blank', 'noopener');

      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="container">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">Get in Touch</span>
          <h2>Send Us a Message</h2>
          <p>Have a question about our services, need a case quote, or want to schedule a lab pickup? Fill in the form below and our team will get back to you promptly.</p>
        </Reveal>

        <Reveal as="div" className="contact-grid">
          <div className="contact-info-card">
            <h3>Contact Information</h3>
            <p>Prefer to speak with us directly? Reach out using the details below, or connect with your nearest area manager in the Service Network above.</p>
            <ul className="contact-info-list">
              <li>
                <span className="ci-ico"><LocationPinIcon /></span>
                <div>
                  <span className="ci-label">Head Office</span>
                  <span className="ci-value">{settings.siteName} {settings.tagline}, {settings.contactAddress}</span>
                </div>
              </li>
              <li>
                <span className="ci-ico"><PhoneIcon /></span>
                <div>
                  <span className="ci-label">Phone</span>
                  <span className="ci-value"><a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a></span>
                </div>
              </li>
              <li>
                <span className="ci-ico"><MailIcon /></span>
                <div>
                  <span className="ci-label">Email</span>
                  <span className="ci-value"><a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></span>
                </div>
              </li>
              <li>
                <span className="ci-ico"><ContentIcon name="clock" /></span>
                <div>
                  <span className="ci-label">Working Hours</span>
                  <span className="ci-value">Monday – Saturday, 9:00 AM – 7:00 PM</span>
                </div>
              </li>
            </ul>
            <div className="contact-info-social">
              <a href="#" aria-label="LinkedIn"><LinkedInIcon /></a>
              <a href="#" aria-label="Instagram"><InstagramIcon /></a>
              <a href="#" aria-label="Facebook"><FacebookIcon /></a>
            </div>
          </div>

          <form className="contact-form-card" id="contactForm" noValidate onSubmit={handleSubmit}>
            <h3 style={{ color: 'var(--navy)', fontSize: '1.15rem' }}>Request a Quote / Enquiry Form</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cf-name">Full Name <span className="req">*</span></label>
                <input type="text" id="cf-name" name="name" placeholder="Dr. Full Name" required value={form.name} onChange={(e) => update('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="cf-clinic">Clinic / Hospital Name</label>
                <input type="text" id="cf-clinic" name="clinic" placeholder="Your clinic or hospital" value={form.clinic} onChange={(e) => update('clinic', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cf-email">Email Address <span className="req">*</span></label>
                <input type="email" id="cf-email" name="email" placeholder="you@example.com" required value={form.email} onChange={(e) => update('email', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="cf-phone">Phone Number <span className="req">*</span></label>
                <input type="tel" id="cf-phone" name="phone" placeholder="+91 XXXXX XXXXX" required value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="cf-subject">I'm Enquiring About</label>
              <select id="cf-subject" name="subject" value={form.subject} onChange={(e) => update('subject', e.target.value)}>
                <option>General Enquiry</option>
                <option>Request a Case Quote</option>
                <option>Schedule a Lab Pickup</option>
                <option>Partnership / New Account</option>
                <option>Product Support</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="cf-message">Message <span className="req">*</span></label>
              <textarea id="cf-message" name="message" rows="5" placeholder="Tell us about your requirement, case details or query…" required value={form.message} onChange={(e) => update('message', e.target.value)}></textarea>
            </div>
            <label className="form-consent">
              <input type="checkbox" required checked={form.consent} onChange={(e) => update('consent', e.target.checked)} />
              I agree to be contacted by DENCO INDIA regarding my enquiry.
            </label>
            {error && <p className="form-note" style={{ color: '#D9611E' }}>{error}</p>}
            <button type="submit" className="btn btn-accent" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send Message'}
              <ArrowRightIcon />
            </button>
            {submitted && (
              <p className="form-note" id="cfNote">
                <CheckIcon />
                Thank you! Your message has been sent — our team will get back to you shortly.
              </p>
            )}
          </form>
        </Reveal>

        <Reveal as="div" className="cta-band">
          <div className="cta-left">
            <span className="cta-ico"><PhoneIcon /></span>
            <h3>Partner with Us for<br />Precision You Can Trust</h3>
          </div>
          <p className="cta-mid">Whether you need a lab pickup scheduled, a case quote or a new partnership — our team is ready to help.</p>
          <a href="#contact" className="btn btn-accent">Book a Lab Pickup
            <ArrowRightIcon />
          </a>
        </Reveal>
      </div>
      <DecorativeLayer hostIndex={8} dark />
    </section>
  );
}
