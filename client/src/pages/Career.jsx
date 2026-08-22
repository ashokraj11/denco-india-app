import { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import { LocationPinIcon, BuildingIcon, ArrowRightIcon } from '../components/icons/UiIcons';
import Reveal from '../components/Reveal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobApplicationModal from '../components/JobApplicationModal';

const SITE_URL = 'https://dencoindia.com/';
const CAREERS_URL = `${SITE_URL}careers`;

// schema.org's JobPosting employmentType is a controlled vocabulary --
// job_openings.employment_type is free text an admin types in, so map the
// common cases and fall back to OTHER rather than sending an invalid value.
function toSchemaEmploymentType(value) {
  const v = (value || '').toLowerCase();
  if (v.includes('part')) return 'PART_TIME';
  if (v.includes('intern')) return 'INTERN';
  if (v.includes('contract')) return 'CONTRACTOR';
  if (v.includes('temp')) return 'TEMPORARY';
  if (v.includes('volunteer')) return 'VOLUNTEER';
  if (v.includes('full')) return 'FULL_TIME';
  return 'OTHER';
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeJsonLd(id) {
  document.getElementById(id)?.remove();
}

function upsertCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function Career() {
  const { data: jobs, loading: jobsLoading } = useFetch('/jobs');
  const { settings } = useSiteSettings();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeJob, setActiveJob] = useState(null);

  useEffect(() => {
    document.title = 'Careers | DENCO INDIA';
    upsertCanonical(CAREERS_URL);

    upsertJsonLd('seo-careers-breadcrumb-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Careers', item: CAREERS_URL }
      ]
    });

    return () => {
      upsertCanonical(SITE_URL);
      removeJsonLd('seo-careers-breadcrumb-jsonld');
    };
  }, []);

  useEffect(() => {
    // Clear any previously-rendered JobPosting scripts before repopulating --
    // otherwise a job removed between renders (filled/closed) would leave a
    // stale script behind.
    document.querySelectorAll('script[id^="seo-jobposting-"]').forEach((el) => el.remove());
    if (!jobs?.length) return undefined;

    const logoSrc = resolveImageUrl(settings.logoUrl);
    jobs.forEach((job) => {
      upsertJsonLd(`seo-jobposting-${job.id}`, {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: job.title,
        description: job.description || job.title,
        datePosted: job.datePosted || undefined,
        employmentType: toSchemaEmploymentType(job.employmentType),
        hiringOrganization: {
          '@type': 'Organization',
          name: settings.siteName || 'DENCO INDIA',
          sameAs: SITE_URL,
          logo: logoSrc || undefined
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: job.location || undefined,
            addressRegion: 'Tamil Nadu',
            addressCountry: 'IN'
          }
        }
      });
    });

    return () => {
      jobs.forEach((job) => removeJsonLd(`seo-jobposting-${job.id}`));
    };
  }, [jobs, settings.siteName, settings.logoUrl]);

  function openApply(job) {
    setActiveJob(job || null);
    setModalOpen(true);
  }

  return (
    <>
      <Navbar />
      <main className="career-page">
        <div className="container">
          <Reveal as="div" className="sec-head" style={{ marginTop: 'calc(var(--nav-h, 5.5rem) + 2.5rem)' }}>
            <span className="eyebrow">Careers</span>
            <h2>Join the DENCO INDIA Team</h2>
            <p>We're always looking for skilled, motivated people to help us deliver precision dental prosthetics and digital dentistry solutions. Explore our current openings below and apply directly.</p>
          </Reveal>

          <Reveal as="div" className="career-jobs">
            {jobsLoading && <p style={{ textAlign: 'center', color: 'var(--mute)' }}>Loading openings…</p>}
            {!jobsLoading && jobs?.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--mute)' }}>
                There are no open positions right now — please check back soon.
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
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => openApply(job)}>
                  Apply Now <ArrowRightIcon />
                </button>
              </div>
            ))}
          </Reveal>
        </div>
      </main>
      <Footer />

      <JobApplicationModal open={modalOpen} job={activeJob} jobs={jobs} onClose={() => setModalOpen(false)} />
    </>
  );
}
