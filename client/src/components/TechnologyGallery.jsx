import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { SearchIcon, PlayIcon } from './icons/UiIcons';
import Reveal from './Reveal';
import Lightbox from './Lightbox';
import DecorativeLayer from './DecorativeLayer';
import { resolveImageUrl } from '../utils/resolveImageUrl';

const INITIAL_VISIBLE = 8; // matches the CSS collage layout, styled for exactly 8 positions

export default function TechnologyGallery() {
  const { data: items, loading } = useFetch('/gallery');
  const [active, setActive] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const visibleItems = showAll ? items : items?.slice(0, INITIAL_VISIBLE);

  function open(item) {
    setActive({ img: resolveImageUrl(item.mediaUrl), title: item.title, type: item.mediaType });
  }

  return (
    <section className="news" id="technology">
      <div className="container">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">Gallery</span>
          <h2>Why Dental Professionals Choose Us</h2>
          <p>A look inside our facility — the technology, workstations and people behind every restoration we deliver.</p>
        </Reveal>

        {loading && <p>Loading gallery…</p>}

        <Reveal as="div" className="gallery-grid">
          {visibleItems?.map((item) => (
            <div
              className="gallery-item"
              key={item.id}
              tabIndex={0}
              role="button"
              aria-haspopup="dialog"
              onClick={() => open(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  open(item);
                }
              }}
            >
              {item.mediaType === 'video' ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video src={resolveImageUrl(item.mediaUrl)} muted playsInline preload="metadata" />
              ) : (
                <img src={resolveImageUrl(item.mediaUrl)} alt={item.title} loading="lazy" />
              )}
              <span className="gallery-zoom">{item.mediaType === 'video' ? <PlayIcon /> : <SearchIcon />}</span>
              <span className="gallery-caption">{item.title}</span>
            </div>
          ))}
        </Reveal>

        {!showAll && items?.length > INITIAL_VISIBLE && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAll(true)}>
              Show More ({items.length - INITIAL_VISIBLE} more)
            </button>
          </div>
        )}
      </div>

      <Lightbox item={active} onClose={() => setActive(null)} />
      <DecorativeLayer hostIndex={6} />
    </section>
  );
}
