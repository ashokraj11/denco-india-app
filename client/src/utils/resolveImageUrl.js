const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

// Storage values are either a relative "/uploads/xyz.jpg" path served by our
// own API, or a full external URL (existing seeded content still uses
// placehold.co/unsplash links) — resolve either into something an <img> can load.
export function resolveImageUrl(value) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `${API_ORIGIN}${value}`;
}
