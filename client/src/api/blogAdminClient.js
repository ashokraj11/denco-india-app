// Trimmed, independent copy of client.js for the standalone blog portal --
// its own token key and its own /blog-admin path-prefix check, so a blog
// session and a site-admin session never interfere with each other (see
// AdminAuthContext.jsx / BlogAdminAuthContext.jsx).
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const TOKEN_KEY = 'denco_blog_admin_token';

function handleUnauthorized(path, status) {
  if (status === 401 && path.startsWith('/blog-admin') && path !== '/blog-admin/login') {
    localStorage.removeItem(TOKEN_KEY);
    if (!window.location.pathname.startsWith('/blog-admin/login')) {
      window.location.href = '/blog-admin/login';
    }
  }
}

async function request(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = { ...(options.headers || {}) };
  if (options.body) headers['Content-Type'] = 'application/json';
  if (token && path.startsWith('/blog-admin')) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    handleUnauthorized(path, res.status);
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }
  return data;
}

async function uploadRequest(path, file, fieldName) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {};
  if (token && path.startsWith('/blog-admin')) headers.Authorization = `Bearer ${token}`;

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

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),
  upload: (path, file) => uploadRequest(path, file, 'image')
};
