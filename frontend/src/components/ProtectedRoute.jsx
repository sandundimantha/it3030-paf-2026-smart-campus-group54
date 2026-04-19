import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — redirects to /login if user is not authenticated.
 * Uses AuthContext (session is checked once on app load, no extra API calls).
 */
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{
          width: '40px', height: '40px',
          border: '4px solid rgba(255,255,255,0.1)',
          borderTop: '4px solid #4285f4',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/**
 * AdminRoute — redirects to /login or shows Access Denied for non-admins.
 */
export function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{
          width: '40px', height: '40px',
          border: '4px solid rgba(255,255,255,0.1)',
          borderTop: '4px solid #4285f4',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        minHeight: '60vh', textAlign: 'center', gap: '1rem'
      }}>
        <span style={{ fontSize: '4rem' }}>🚫</span>
        <h2 style={{ color: '#f1f5f9', fontSize: '1.5rem' }}>Access Denied</h2>
        <p style={{ color: '#94a3b8' }}>You need ADMIN privileges to view this page.</p>
        <a href="/" style={{ color: '#60a5fa', textDecoration: 'none' }}>← Back to Home</a>
      </div>
    );
  }

  return children;
}
