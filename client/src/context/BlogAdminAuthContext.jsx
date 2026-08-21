import { createContext, useCallback, useContext, useState } from 'react';
import { api } from '../api/blogAdminClient';

const BlogAdminAuthContext = createContext(null);
const TOKEN_KEY = 'denco_blog_admin_token';

export function BlogAdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [username, setUsername] = useState(null);

  const login = useCallback(async (creds) => {
    const result = await api.post('/blog-admin/login', creds);
    localStorage.setItem(TOKEN_KEY, result.token);
    setToken(result.token);
    setUsername(result.username);
    return result;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUsername(null);
  }, []);

  return (
    <BlogAdminAuthContext.Provider value={{ token, username, isAuthenticated: !!token, login, logout }}>
      {children}
    </BlogAdminAuthContext.Provider>
  );
}

export function useBlogAdminAuth() {
  const ctx = useContext(BlogAdminAuthContext);
  if (!ctx) throw new Error('useBlogAdminAuth must be used within BlogAdminAuthProvider');
  return ctx;
}
