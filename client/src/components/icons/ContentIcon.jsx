// Renders the small, fixed set of icons referenced by `icon_key` columns in
// the database (services, product_categories, stats). Keeping these as a
// lookup table — instead of storing raw SVG markup in MySQL — avoids ever
// injecting DB content as HTML/SVG on the client.
const PATHS = {
  crown: (
    <path d="M12 3v6M9 6h6M6 12c0 4 2.5 8 6 9 3.5-1 6-5 6-9a6 6 0 0 0-12 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  ),
  cadcam: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="16.5" cy="15.5" r="1.2" fill="currentColor" />
    </>
  ),
  zirconia: (
    <path d="M12 2l8 4v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  ),
  implant: (
    <>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  denture: (
    <path d="M4 18c2-1 4-1 6 0M4 18V9c2-2 4-2 6-1M4 18V9M14 18c2-1 4-1 6 0M14 18V9c2-2 4-2 6-1M14 18V9M10 8V6M10 8c0 1-1 1-1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  scan: (
    <>
      <path d="M4 7l8-4 8 4-8 4-8-4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 7v6l8 4 8-4V7M4 13v4l8 4 8-4v-4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </>
  ),
  'check-badge': (
    <>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  star: (
    <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  ),
  'sparkle-star': (
    <path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.5 6.8L12 17l-6.2 3.5 1.5-6.8L2.2 9l6.9-.7L12 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  ),
  'shield-check': (
    <>
      <path d="M12 2l7 3v6c0 5-3 8.5-7 10-4-1.5-7-5-7-10V5l7-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  precision: (
    <path d="M12 2v6M9 5h6M6 11c0 4 2.5 8 6 9 3.5-1 6-5 6-9a6 6 0 0 0-12 0Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  users: (
    <>
      <path d="M4 20v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M17 4c1.8.4 3 2 3 3.8 0 1.6-1 3-2.4 3.6M20 20v-1.6c0-1.6-.9-3-2.2-3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  award: (
    <>
      <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7 6H4a3 3 0 0 0 3 5M17 6h3a3 3 0 0 1-3 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  // ---- Additional dental / business icons for the category & service picker ----
  tooth: (
    <path d="M12 3c-2.6 0-4.9 1.6-5.3 4.3-.2 1.6 0 2.7.6 4.2.7 1.7 1.2 3.2 1.5 5.9.1 1.1.8 1.9 1.6 1.9.8 0 1.4-.7 1.6-1.8.2-2 .6-3 1.1-4.3.2-.4.6-.4.8 0 .5 1.3.9 2.3 1.1 4.3.2 1.1.8 1.8 1.6 1.8.8 0 1.5-.8 1.6-1.9.3-2.7.8-4.2 1.5-5.9.6-1.5.8-2.6.6-4.2C16.9 4.6 14.6 3 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  ),
  molar: (
    <path d="M12 3c-3 0-6 1.6-6.4 4.6-.2 1.5.1 2.6.7 3.9.6 1.3 1 2.4 1.1 4.6.1 1.4.9 2.3 1.8 2.3.8 0 1.5-.7 1.6-1.9.1-1.1.3-1.9.6-2.6.3.7.5 1.5.6 2.6.1 1.2.8 1.9 1.6 1.9.9 0 1.7-.9 1.8-2.3.1-2.2.5-3.3 1.1-4.6.6-1.3.9-2.4.7-3.9C18 4.6 15 3 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  ),
  toothbrush: (
    <>
      <path d="M4 20 13 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12.3 6.3l5.4 5.4-2.1 2.1-5.4-5.4 2.1-2.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 5l1-1M16.5 7.5l1-1M19 10l1-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </>
  ),
  floss: (
    <>
      <path d="M4 8c3 3.4 5-3.4 8 0s5-3.4 8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="4" cy="8" r="1.5" fill="currentColor" />
      <circle cx="20" cy="8" r="1.5" fill="currentColor" />
    </>
  ),
  smile: (
    <path d="M6 10c1.5 3 3.8 5 6 5s4.5-2 6-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  ),
  xray: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.4" />
    </>
  ),
  injection: (
    <>
      <path d="M5 19l5-5M9 15l6-6M17 7l2-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="19" cy="5" r="1.5" fill="currentColor" />
    </>
  ),
  chair: (
    <path d="M6 21v-7a3 3 0 0 1 3-3h2M6 14h9a3 3 0 0 1 3 3v1M11 11V5a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  magnifier: (
    <>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m21 21-4.3-4.3M11 8v6M8 11h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  certificate: (
    <>
      <rect x="5" y="3" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 19l3-2 3 2v-4H9v4Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8 7h8M8 10h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 10h16M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  truck: (
    <>
      <rect x="2" y="8" width="11" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 11h4l3 3v2h-7v-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="16" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.3" />
    </>
  ),
  package: (
    <>
      <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4 7l8 4 8-4M12 11v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6M10 3v5l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M8 15h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  printer: (
    <>
      <rect x="5" y="9" width="14" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 9V4h10v5M7 16v4h10v-4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="16" cy="12" r="1" fill="currentColor" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  heart: (
    <path d="M12 20s-7-4.4-9.5-9C1 8 2.5 4 6.5 4c2 0 3.5 1.2 4.5 2.8C12 5.2 13.5 4 15.5 4 19.5 4 21 8 19.5 11 17 15.6 12 20 12 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  ),
  handshake: (
    <>
      <circle cx="7" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  clinic: (
    <>
      <path d="M4 21V9l8-5 8 5v12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 12h.01M15 12h.01M12 9h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 12h18M12 3c2.5 2.5 4 5.8 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.8-4-9s1.5-6.5 4-9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </>
  ),
  mappin: (
    <>
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    </>
  ),
  shield: (
    <path d="M12 3l7 3v6c0 5-3 8.5-7 9-4-.5-7-4-7-9V6l7-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  )
};

export default function ContentIcon({ name, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...rest}>
      {PATHS[name] || null}
    </svg>
  );
}
