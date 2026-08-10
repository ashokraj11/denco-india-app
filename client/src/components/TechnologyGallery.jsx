import { useState } from 'react';
import { SearchIcon } from './icons/UiIcons';
import Reveal from './Reveal';
import Lightbox from './Lightbox';
import DecorativeLayer from './DecorativeLayer';

const GALLERY = [
  { title: 'CAD/CAM Design Studio', full: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1400&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop' },
  { title: 'Zirconia Milling Unit', full: 'https://images.unsplash.com/photo-1581093458791-9d2b11e94a9d?q=80&w=1400&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1581093458791-9d2b11e94a9d?q=80&w=700&auto=format&fit=crop' },
  { title: 'Digital Scanning Station', full: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1400&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=700&auto=format&fit=crop' },
  { title: 'Model Trimming & Finishing', full: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1400&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=700&auto=format&fit=crop' },
  { title: 'Quality Inspection Bench', full: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=1400&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=700&auto=format&fit=crop' },
  { title: 'Technician Workstation', full: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1400&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=700&auto=format&fit=crop' },
  { title: 'Packaging & Dispatch', full: 'https://images.unsplash.com/photo-1600959907703-125ba1374a12?q=80&w=1400&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1600959907703-125ba1374a12?q=80&w=700&auto=format&fit=crop' },
  { title: 'Reception & Consultation Area', full: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?q=80&w=1400&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?q=80&w=700&auto=format&fit=crop' }
];

export default function TechnologyGallery() {
  const [active, setActive] = useState(null);

  return (
    <section className="news" id="technology">
      <div className="container">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">Technology &amp; Infrastructure</span>
          <h2>Why Dental Professionals Choose Us</h2>
          <p>A look inside our facility — the technology, workstations and people behind every restoration we deliver.</p>
        </Reveal>

        <Reveal as="div" className="gallery-grid">
          {GALLERY.map((item) => (
            <div
              className="gallery-item"
              key={item.title}
              tabIndex={0}
              role="button"
              aria-haspopup="dialog"
              onClick={() => setActive({ img: item.full, title: item.title })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActive({ img: item.full, title: item.title });
                }
              }}
            >
              <img src={item.thumb} alt={item.title} loading="lazy" />
              <span className="gallery-zoom"><SearchIcon /></span>
              <span className="gallery-caption">{item.title}</span>
            </div>
          ))}
        </Reveal>
      </div>

      <Lightbox item={active} onClose={() => setActive(null)} />
      <DecorativeLayer hostIndex={6} />
    </section>
  );
}
