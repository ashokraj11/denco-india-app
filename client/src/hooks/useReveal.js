import { useEffect, useRef, useState } from 'react';

// Mirrors the original data-reveal IntersectionObserver: fades an element in
// once it scrolls into view, then stops observing it.
export function useReveal() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.unobserve(entry.target);
          }
        });
      },
      // threshold measures intersection as a fraction of the target's OWN
      // height, which works fine for normal-sized cards but is a poor fit
      // for very tall elements (e.g. the mobile gallery grid, which stacks
      // into a single tall column) -- 15% of a huge element can require
      // scrolling deep past it before it's ever considered "in view",
      // leaving a large blank gap the whole time. Trigger as soon as any
      // part enters instead.
      { threshold: 0, rootMargin: '0px 0px -60px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, inView];
}
