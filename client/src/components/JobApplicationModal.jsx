import { useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import { ArrowRightIcon, CheckIcon, CloseIcon } from './icons/UiIcons';

const EMPTY_FORM = { name: '', email: '', phone: '', message: '' };

// job: the job opening the "Apply Now" button was clicked from (or null for
// a general application), plus the full jobs list so the dropdown inside
// still lets the candidate switch roles. open === false when closed --
// kept mounted (not unmounted) so the closing transition can play.
export default function JobApplicationModal({ open, job, jobs, onClose }) {
  const closeRef = useRef(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [jobId, setJobId] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    // Reset to a clean form each time the modal is opened, pre-selecting
    // whichever job the "Apply Now" click came from (or "" for general).
    setForm(EMPTY_FORM);
    setFile(null);
    setSubmitted(false);
    setError(null);
    setJobId(job ? String(job.id) : '');

    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, job, onClose]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !file) {
      e.target.reportValidity?.();
      if (!file) setError('Please attach your resume (PDF or Word document).');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitWithFile('/job-applications', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        job_id: jobId || undefined,
        message: form.message.trim() || undefined
      }, file);

      setSubmitted(true);
      setForm(EMPTY_FORM);
      setFile(null);
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className={`job-apply-modal${open ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="job-apply-modal-inner">
        <button className="cert-lightbox-close" aria-label="Close" onClick={onClose} ref={closeRef}>
          <CloseIcon />
        </button>

        <form className="contact-form-card" noValidate onSubmit={handleSubmit}>
          <h3 style={{ color: 'var(--navy)', fontSize: '1.15rem' }}>
            {job ? `Apply for ${job.title}` : 'Application Form'}
          </h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="jf-name">Full Name <span className="req">*</span></label>
              <input type="text" id="jf-name" required value={form.name} onChange={(e) => update('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="jf-role">Applying For</label>
              <select id="jf-role" value={jobId} onChange={(e) => setJobId(e.target.value)}>
                <option value="">General Application</option>
                {jobs?.map((j) => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="jf-email">Email Address <span className="req">*</span></label>
              <input type="email" id="jf-email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="jf-phone">Phone Number <span className="req">*</span></label>
              <input type="tel" id="jf-phone" required value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="jf-resume">Resume <span className="req">*</span></label>
            <input
              type="file"
              id="jf-resume"
              required
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <span style={{ fontSize: '.78rem', color: 'var(--mute)' }}>PDF or Word document, up to 10MB.</span>
          </div>
          <div className="form-group">
            <label htmlFor="jf-message">Message (optional)</label>
            <textarea id="jf-message" rows="4" placeholder="Tell us a bit about yourself…" value={form.message} onChange={(e) => update('message', e.target.value)}></textarea>
          </div>
          {error && <p className="form-note" style={{ color: '#D9611E' }}>{error}</p>}
          <button type="submit" className="btn btn-accent" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Application'}
            <ArrowRightIcon />
          </button>
          {submitted && (
            <p className="form-note">
              <CheckIcon />
              Thank you! Your application has been received — our team will be in touch if there's a match.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
