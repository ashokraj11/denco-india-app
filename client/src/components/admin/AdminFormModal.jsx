import { useEffect, useRef } from 'react';
import { CloseIcon } from '../icons/UiIcons';

// Shared popup wrapper for every admin list page's add/edit form -- kept
// mounted (not unmounted) whenever `open` is false so the closing
// transition can play, same pattern as JobApplicationModal/Lightbox.
export default function AdminFormModal({ open, onClose, children }) {
  const closeRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    // Focus the form's first field, not the close button -- landing focus on
    // a <button> means every following keystroke goes nowhere (buttons
    // ignore character input, and Enter/Space on it closes the popup) until
    // the admin clicks into a field themselves, which reads as "the
    // keyboard doesn't work" in here.
    const firstField = innerRef.current?.querySelector('input, select, textarea');
    (firstField || closeRef.current)?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
    // Deliberately NOT depending on `onClose` -- none of the admin pages
    // memoize their cancelEdit handler, so it's a new function reference on
    // every render. Typing in any field re-renders the parent (setForm),
    // and with onClose in the deps that reran this effect on every single
    // keystroke -- re-focusing the first field and yanking focus away from
    // whatever field was actually being typed into.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div
      className={`admin-modal${open ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="admin-modal-inner" ref={innerRef}>
        <button className="cert-lightbox-close" aria-label="Close" onClick={onClose} ref={closeRef}>
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>
  );
}
