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
  )
};

export default function ContentIcon({ name, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...rest}>
      {PATHS[name] || null}
    </svg>
  );
}
