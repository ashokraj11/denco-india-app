// Small, fixed decorative/navigational icons used directly in JSX (not
// driven by database content), ported verbatim from the original markup.

export function ArrowRightIcon({ strokeWidth = 2, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...rest}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EyeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function EyeOffIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function PlayIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronDownIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronUpIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="12" height="12" {...props}>
      <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LocationPinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function PhoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 4h16v16H4V4Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="m4 6 8 7 8-7" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m21 21-4.3-4.3M11 8v6M8 11h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PersonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="8" r="4" stroke="#fff" strokeWidth="1.8" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function BuildingIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 21V7l8-4 8 4v14" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 21v-6h6v6" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function BrandMarkIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 2.6c-3.2 0-5.9 2-6.4 5.2-.3 1.9 0 3.3.7 5.1.8 2.1 1.5 3.9 1.8 7.2.1 1.4 1 2.3 2 2.3.9 0 1.7-.8 1.9-2.2.3-2.4.7-3.7 1.4-5.2.2-.5.7-.5.9 0 .7 1.5 1.1 2.8 1.4 5.2.2 1.4 1 2.2 1.9 2.2 1 0 1.9-.9 2-2.3.3-3.3 1-5.1 1.8-7.2.7-1.8 1-3.2.7-5.1-.5-3.2-3.2-5.2-6.4-5.2Z" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

export function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM3 8.5h4V21H3V8.5Zm6.5 0h3.8v1.7h.05c.53-1 1.83-2 3.77-2 4.03 0 4.78 2.65 4.78 6.1V21h-4v-6c0-1.43-.03-3.28-2-3.28-2 0-2.3 1.56-2.3 3.18V21h-4V8.5Z" />
    </svg>
  );
}

export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm0 5.8a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6ZM16 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5Zm3.5 13a3.5 3.5 0 0 1-3.5 3.5H8A3.5 3.5 0 0 1 4.5 16V8A3.5 3.5 0 0 1 8 4.5h8A3.5 3.5 0 0 1 19.5 8v8ZM17 6.3a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
    </svg>
  );
}

export function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.25-1.5 1.55-1.5H16.7V3.7C16.4 3.65 15.4 3.55 14.2 3.55c-2.5 0-4.2 1.5-4.2 4.3v2.05H7.3V13h2.7v8h3.5Z" />
    </svg>
  );
}

export function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.2 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.8ZM10 15.2V8.8L15.5 12 10 15.2Z" />
    </svg>
  );
}

export function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 9.5h17M8 3v3.6M16 3v3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function TagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M11.4 3.5H6a2.5 2.5 0 0 0-2.5 2.5v5.4c0 .66.26 1.3.73 1.77l8.15 8.15a2.5 2.5 0 0 0 3.54 0l5.4-5.4a2.5 2.5 0 0 0 0-3.54L13.17 4.23a2.5 2.5 0 0 0-1.77-.73Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="8.2" cy="8.2" r="1.4" fill="currentColor" />
    </svg>
  );
}
