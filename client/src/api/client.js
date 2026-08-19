const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const TOKEN_KEY = 'denco_admin_token';

// A 401 on any admin call means the token is missing/expired/invalid --
// every admin page was otherwise just displaying the raw "Invalid or
// expired token" error inline and leaving the user stuck on a broken page.
// Clear the stale token and send them back to log in instead.
function handleUnauthorized(path, status) {
  if (status === 401 && path.startsWith('/admin') && path !== '/admin/login') {
    localStorage.removeItem(TOKEN_KEY);
    if (!window.location.pathname.startsWith('/admin/login')) {
      window.location.href = '/admin/login';
    }
  }
}

async function request(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = { ...(options.headers || {}) };
  if (options.body) headers['Content-Type'] = 'application/json';
  if (token && path.startsWith('/admin')) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    handleUnauthorized(path, res.status);
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }
  return data;
}

// Separate from request() because FormData must NOT get a JSON Content-Type
// (the browser sets the multipart boundary itself).
async function uploadRequest(path, file, fieldName) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {};
  if (token && path.startsWith('/admin')) headers.Authorization = `Bearer ${token}`;

  const formData = new FormData();
  formData.append(fieldName, file);

  const res = await fetch(`${API_URL}${path}`, { method: 'POST', headers, body: formData });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    handleUnauthorized(path, res.status);
    throw new Error(data?.error || `Upload failed with status ${res.status}`);
  }
  return data;
}

// Like uploadRequest, but for forms that combine a file with other text
// fields in one multipart request (e.g. a job application: resume file +
// name/email/phone/message) — uploadRequest only ever appends a single file
// field and nothing else.
async function uploadFormRequest(path, fields, file, fieldName) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {};
  if (token && path.startsWith('/admin')) headers.Authorization = `Bearer ${token}`;

  const formData = new FormData();
  Object.entries(fields || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') formData.append(key, value);
  });
  formData.append(fieldName, file);

  const res = await fetch(`${API_URL}${path}`, { method: 'POST', headers, body: formData });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    handleUnauthorized(path, res.status);
    throw new Error(data?.error || `Submission failed with status ${res.status}`);
  }
  return data;
}

// Downloads a protected (Authorization-header-requiring) endpoint's response
// as a file — a plain <a href> can't attach that header, so this fetches it
// as a blob and triggers the save via a throwaway link instead. Reads the
// body as a stream (rather than one res.blob() call) so onProgress can be
// told how far along a large backup download is.
async function downloadFile(path, fallbackFilename, onProgress) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {};
  if (token && path.startsWith('/admin')) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { headers });
  if (!res.ok) {
    handleUnauthorized(path, res.status);
    let message = `Download failed with status ${res.status}`;
    try { message = (await res.json())?.error || message; } catch { /* not JSON */ }
    throw new Error(message);
  }

  const disposition = res.headers.get('content-disposition') || '';
  const match = disposition.match(/filename="?([^"]+)"?/);
  const filename = match?.[1] || fallbackFilename;

  const total = Number(res.headers.get('content-length')) || 0;
  let blob;
  if (total > 0 && res.body && onProgress) {
    const reader = res.body.getReader();
    const chunks = [];
    let received = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      onProgress(Math.min(100, Math.round((received / total) * 100)));
    }
    blob = new Blob(chunks);
  } else {
    // No Content-Length (e.g. a chunked/streamed response) -- fall back to
    // an indeterminate download with no percentage.
    blob = await res.blob();
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),
  upload: (path, file) => uploadRequest(path, file, 'image'),
  uploadMedia: (path, file) => uploadRequest(path, file, 'media'),
  uploadDocument: (path, file) => uploadRequest(path, file, 'document'),
  uploadBackup: (path, file) => uploadRequest(path, file, 'backup'),
  submitWithFile: (path, fields, file) => uploadFormRequest(path, fields, file, 'resume'),
  download: (path, fallbackFilename, onProgress) => downloadFile(path, fallbackFilename, onProgress)
};
