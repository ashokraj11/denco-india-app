import { useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import { useFetch } from '../hooks/useFetch';
import { LocationPinIcon, BuildingIcon, ArrowRightIcon, CheckIcon } from '../components/icons/UiIcons';
import Reveal from '../components/Reveal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EMPTY_FORM = { name: '', email: '', phone: '', job_id: '', message: '' };

export default function Career() {
  const { data: jobs, loading: jobsLoading } = useFetch('/jobs');
  const formRef = useRef(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Careers | DENCO INDIA';
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleApplyClick(jobId) {
    update('job_id', String(jobId));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        job_id: form.job_id || undefined,
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
    <>
      <Navbar />
      <main className="career-page">
        <div className="container">
          <Reveal as="div" className="sec-head" style={{ marginTop: 'calc(var(--nav-h, 5.5rem) + 2.5rem)' }}>
            <span className="eyebrow">Careers</span>
            <h2>Join the DENCO INDIA Team</h2>
            <p>We're always looking for skilled, motivated people to help us deliver precision dental prosthetics and digital dentistry solutions. Explore our current openings below, or send us a general application.</p>
          </Reveal>

          <Reveal as="div" className="career-jobs">
            {jobsLoading && <p style={{ textAlign: 'center', color: 'var(--mute)' }}>Loading openings…</p>}
            {!jobsLoading && jobs?.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--mute)' }}>
                There are no open positions right now — feel free to send a general application below.
              </p>
            )}
            {jobs?.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-card-main">
                  <h3>{job.title}</h3>
                  <div className="job-card-meta">
                    <span><BuildingIcon /> {job.employmentType}</span>
                    {job.location && <span><LocationPinIcon /> {job.location}</span>}
                  </div>
                  {job.description && <p>{job.description}</p>}
                </div>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleApplyClick(job.id)}>
                  Apply Now <ArrowRightIcon />
                </button>
              </div>
            ))}
          </Reveal>

          <Reveal as="div" style={{ maxWidth: 640, margin: '0 auto' }}>
            <form ref={formRef} className="contact-form-card" noValidate onSubmit={handleSubmit}>
              <h3 style={{ color: 'var(--navy)', fontSize: '1.15rem' }}>Application Form</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="jf-name">Full Name <span className="req">*</span></label>
                  <input type="text" id="jf-name" required value={form.name} onChange={(e) => update('name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="jf-role">Applying For</label>
                  <select id="jf-role" value={form.job_id} onChange={(e) => update('job_id', e.target.value)}>
                    <option value="">General Application</option>
                    {jobs?.map((job) => (
                      <option key={job.id} value={job.id}>{job.title}</option>
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
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
