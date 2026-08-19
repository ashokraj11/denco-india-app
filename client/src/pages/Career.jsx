import { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { LocationPinIcon, BuildingIcon, ArrowRightIcon } from '../components/icons/UiIcons';
import Reveal from '../components/Reveal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobApplicationModal from '../components/JobApplicationModal';

export default function Career() {
  const { data: jobs, loading: jobsLoading } = useFetch('/jobs');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeJob, setActiveJob] = useState(null);

  useEffect(() => {
    document.title = 'Careers | DENCO INDIA';
  }, []);

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
