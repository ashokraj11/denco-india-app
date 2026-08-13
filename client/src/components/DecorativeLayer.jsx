import { useEffect, useMemo, useRef, useState } from 'react';

// Ports the two purely-cosmetic flourishes from the original site: a
// "blade sheen" light sweep that replays each time a section scrolls into
// view, and a handful of randomly-placed floating tooth/dental motifs.
// Rendered once inside every top-level section, mirroring the original's
// `header.hero, section, footer` targeting.

const DENTAL_ICON_PATHS = [
  <path key="tooth" d="M12 3c-2.6 0-4.9 1.6-5.3 4.3-.2 1.6 0 2.7.6 4.2.7 1.7 1.2 3.2 1.5 5.9.1 1.1.8 1.9 1.6 1.9.8 0 1.4-.7 1.6-1.8.2-2 .6-3 1.1-4.3.2-.4.6-.4.8 0 .5 1.3.9 2.3 1.1 4.3.2 1.1.8 1.8 1.6 1.8.8 0 1.5-.8 1.6-1.9.3-2.7.8-4.2 1.5-5.9.6-1.5.8-2.6.6-4.2C16.9 4.6 14.6 3 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
  <path key="molar" d="M12 3c-3 0-6 1.6-6.4 4.6-.2 1.5.1 2.6.7 3.9.6 1.3 1 2.4 1.1 4.6.1 1.4.9 2.3 1.8 2.3.8 0 1.5-.7 1.6-1.9.1-1.1.3-1.9.6-2.6.3.7.5 1.5.6 2.6.1 1.2.8 1.9 1.6 1.9.9 0 1.7-.9 1.8-2.3.1-2.2.5-3.3 1.1-4.6.6-1.3.9-2.4.7-3.9C18 4.6 15 3 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
  <path key="brush" d="M4 20 13 11M12.3 6.3l5.4 5.4-2.1 2.1-5.4-5.4 2.1-2.1ZM14 5l1-1M16.5 7.5l1-1M19 10l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  <g key="floss"><path d="M4 8c3 3.4 5-3.4 8 0s5-3.4 8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="4" cy="8" r="1.5" fill="currentColor" /><circle cx="20" cy="8" r="1.5" fill="currentColor" /></g>,
  <path key="sparkle" d="M12 3v4.5M12 16.5V21M3 12h4.5M16.5 12H21M6.5 6.5l3 3M14.5 14.5l3 3M17.5 6.5l-3 3M9.5 14.5l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />,
  <path key="implant" d="M12 3v3.5M8 6.5h8l-1.3 12.7a2.7 2.7 0 0 1-2.7 2.4 2.7 2.7 0 0 1-2.7-2.4L8 6.5ZM8.6 9.5h6.8M9 12.5h6M9.3 15.5h5.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />,
  <path key="crown" d="M6 10 3 6l4.5 2L12 4l4.5 4L21 6l-3 4H6ZM6 10h12l-1.2 8.4A2 2 0 0 1 14.8 20H9.2a2 2 0 0 1-2-1.6L6 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
];

const TOOTH_SPOTS = [
  { top: '6%', left: '3%' }, { top: '10%', left: '93%' },
  { top: '26%', left: '8%' }, { top: '32%', left: '88%' },
  { top: '50%', left: '2%' }, { top: '46%', left: '96%' },
  { top: '66%', left: '6%' }, { top: '72%', left: '90%' },
  { top: '86%', left: '4%' }, { top: '90%', left: '92%' },
  { top: '18%', left: '50%' }, { top: '94%', left: '50%' }
];

// Mirrors the logo's three brand colors: mostly the default ink green, with
// occasional orange and blue accents sprinkled in for variety.
function pickNonDarkColorClass() {
  const r = Math.random();
  if (r < 0.22) return 'accent';
  if (r < 0.4) return 'blue';
  return '';
}

function pickSpots(count) {
  const usedIdx = [];
  const spots = [];
  for (let i = 0; i < count; i++) {
    let idx;
    do { idx = Math.floor(Math.random() * TOOTH_SPOTS.length); }
    while (usedIdx.includes(idx) && usedIdx.length < TOOTH_SPOTS.length);
    usedIdx.push(idx);
    spots.push(TOOTH_SPOTS[idx]);
  }
  return spots;
}

export default function DecorativeLayer({ hostIndex = 0, dark = false }) {
  const sheenRef = useRef(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = sheenRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setPlay(entry.isIntersecting)),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const teeth = useMemo(() => {
    const count = 3 + (hostIndex % 3);
    return pickSpots(count).map((spot, i) => ({
      spot,
      size: 22 + Math.round(Math.random() * 18),
      rotation: -20 + Math.round(Math.random() * 40),
      duration: (7 + Math.random() * 5).toFixed(1),
      delay: (Math.random() * 4).toFixed(1),
      opacity: (0.14 + Math.random() * 0.16).toFixed(2),
      icon: DENTAL_ICON_PATHS[Math.floor(Math.random() * DENTAL_ICON_PATHS.length)],
      colorClass: dark ? 'tooth-light' : pickNonDarkColorClass(),
      key: `${hostIndex}-${i}`
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostIndex, dark]);

  return (
    <>
      <div className={`blade-sheen${play ? ' sheen-play' : ''}`} ref={sheenRef}></div>
      {teeth.map((t) => (
        <div
          key={t.key}
          className={`floating-tooth${t.colorClass ? ` ${t.colorClass}` : ''}`}
          style={{
            width: t.size, height: t.size, top: t.spot.top, left: t.spot.left,
            opacity: t.opacity, '--tooth-rot': `${t.rotation}deg`,
            animationDuration: `${t.duration}s`, animationDelay: `${t.delay}s`
          }}
        >
          <svg viewBox="0 0 24 24" fill="none">{t.icon}</svg>
        </div>
      ))}
    </>
  );
}
