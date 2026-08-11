// Background color for a category/service icon badge. The original six
// icons had a hand-picked alternating accent/navy pattern; any of the newer
// icon choices fall back to a deterministic (but still varied) color so a
// given icon_key always renders the same way without needing a manual
// entry added here every time a new icon is picked.
const OVERRIDES = { crown: 'accent', cadcam: 'navy', zirconia: 'accent', implant: 'navy', denture: 'accent', scan: 'navy' };

export function getIconBg(key) {
  if (OVERRIDES[key]) return `var(--${OVERRIDES[key]})`;
  let hash = 0;
  for (let i = 0; i < (key || '').length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  return Math.abs(hash) % 2 === 0 ? 'var(--accent)' : 'var(--navy)';
}
