import { useEffect, useRef } from 'react';
import { CloseIcon } from './icons/UiIcons';

// Shared lightbox used for the certifications grid and the technology
// gallery. `item` is null when closed; otherwise { img, title, desc?, type? }.
// type: 'image' (default) or 'video' — video renders a playable <video> instead of <img>.
export default function Lightbox({ item, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!item) return undefined;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [item, onClose]);

  return (
    <div
      className={`cert-lightbox${item ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!item}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="cert-lightbox-inner">
        <button className="cert-lightbox-close" aria-label="Close" onClick={onClose} ref={closeRef}>
          <CloseIcon />
        </button>
        <div className="cert-lightbox-media">
          {item?.type === 'video' ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video src={item.img} controls autoPlay style={{ width: '100%', maxHeight: '72vh' }} />
          ) : (
            <img src={item?.img || ''} alt={item?.title || ''} />
          )}
        </div>
        <div className="cert-lightbox-body">
          <h5>{item?.title || ''}</h5>
          {item?.desc ? <span>{item.desc}</span> : null}
        </div>
      </div>
    </div>
  );
}
