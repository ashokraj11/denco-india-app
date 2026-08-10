import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { SearchIcon } from './icons/UiIcons';
import Reveal from './Reveal';
import Lightbox from './Lightbox';
import DecorativeLayer from './DecorativeLayer';
import { resolveImageUrl } from '../utils/resolveImageUrl';

export default function Certifications() {
  const { data: certs, loading } = useFetch('/certifications');
  const [active, setActive] = useState(null);

  return (
    <section className="certs" id="certs">
      <div className="container">
        <Reveal as="div" className="sec-head" style={{ marginBottom: '2rem' }}>
          <span className="eyebrow">Quality You Can Trust</span>
          <h2>Recognised Against Global Standards</h2>
        </Reveal>
        <Reveal as="div" className="cert-image-grid">
          {loading && <p>Loading certifications…</p>}
          {certs?.map((cert) => (
            <div
              className="cert-card"
              key={cert.id}
              tabIndex={0}
              role="button"
              aria-haspopup="dialog"
              onClick={() => setActive({ img: resolveImageUrl(cert.image_url), title: cert.title, desc: cert.description })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActive({ img: resolveImageUrl(cert.image_url), title: cert.title, desc: cert.description });
                }
              }}
            >
              <div className="cert-card-media">
                <img src={resolveImageUrl(cert.image_url)} alt={`${cert.title} Certificate`} loading="lazy" />
                <span className="cert-zoom"><SearchIcon /></span>
              </div>
              <div className="cert-card-body">
                <h5>{cert.title}</h5>
                <span>{cert.description}</span>
              </div>
            </div>
          ))}
        </Reveal>
      </div>

      <Lightbox item={active} onClose={() => setActive(null)} />
      <DecorativeLayer hostIndex={5} />
    </section>
  );
}
