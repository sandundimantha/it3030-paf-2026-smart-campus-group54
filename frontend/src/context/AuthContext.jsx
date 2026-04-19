import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * AuthContext — Global authentication state for the Smart Campus Hub.
 *
 * Provides:
 *   - user: { email, name, role, pictureUrl } | null
 *   - loading: boolean (true while checking session on first load)
 *   - login(email, password): Promise — authenticates and sets user
 *   - register(email, name, password): Promise — creates account
 *   - logout(): Promise — clears session
 *   - isAdmin: boolean shorthand
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Check session on mount

  // On mount: check if the server session is still valid
  useEffect(() => {
    api.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { username: email, password });
    // After login, fetch full profile to populate context
    const profile = await api.get('/auth/me');
    setUser(profile.data);
    return res.data;
  }, []);

  const register = useCallback(async (email, name, password) => {
    const res = await api.post('/auth/register', { email, name, password });
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (_) {
      // Ignore errors — clear local state regardless
    }
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === 'ADMIN',
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth() hook — consume auth context in any component.
 * Usage: const { user, login, logout, isAdmin } = useAuth();
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
