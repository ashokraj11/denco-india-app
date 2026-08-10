import { useEffect } from 'react';

// Ports the original click handler that smooth-scrolls to in-page anchors
// with an offset so content doesn't land underneath the fixed nav.
export function useSmoothAnchorScroll() {
  useEffect(() => {
    function onClick(e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}
