import { useEffect, useRef } from 'react';
import { CloseIcon } from '../icons/UiIcons';

// Shared popup wrapper for every admin list page's add/edit form -- kept
// mounted (not unmounted) whenever `open` is false so the closing
// transition can play, same pattern as JobApplicationModal/Lightbox.
export default function AdminFormModal({ open, onClose, children }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <div
      className={`admin-modal${open ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="admin-modal-inner">
        <button className="cert-lightbox-close" aria-label="Close" onClick={onClose} ref={closeRef}>
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>
  );
}
