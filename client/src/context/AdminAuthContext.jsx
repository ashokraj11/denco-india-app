import { createContext, useCallback, useContext, useState } from 'react';
import { api } from '../api/client';

const AdminAuthContext = createContext(null);
const TOKEN_KEY = 'denco_admin_token';

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [username, setUsername] = useState(null);

  const login = useCallback(async (creds) => {
    const result = await api.post('/admin/login', creds);
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
    <AdminAuthContext.Provider value={{ token, username, isAuthenticated: !!token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
