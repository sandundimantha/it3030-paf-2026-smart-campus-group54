import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import userService from '../services/userService';

/**
 * Shared auth context (simple — no Context API needed for this scope)
 * If you want to scale this, move to React Context later.
 */

/**
 * ProtectedRoute: wraps pages that require login.
 * If the user is not authenticated, redirects to /login.
 */
export function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'auth' | 'unauth'

  useEffect(() => {
    userService.getMyProfile()
      .then(() => setStatus('auth'))
      .catch(() => setStatus('unauth'));
  }, []);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{
          width: '40px', height: '40px',
          border: '4px solid rgba(255,255,255,0.1)',
          borderTop: '4px solid #4285f4',
          borderRadius: '50%',
        }} />
      </div>
    );
  }

  if (status === 'unauth') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/**
 * AdminRoute: wraps pages that require ADMIN role.
 * If user is not admin, shows Access Denied.
 */
export function AdminRoute({ children }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'admin' | 'denied' | 'unauth'

  useEffect(() => {
    userService.getMyProfile()
      .then(user => {
        if (user.role === 'ADMIN') {
          setStatus('admin');
        } else {
          setStatus('denied');
        }
      })
      .catch(() => setStatus('unauth'));
  }, []);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{
          width: '40px', height: '40px',
          border: '4px solid rgba(255,255,255,0.1)',
          borderTop: '4px solid #4285f4',
          borderRadius: '50%',
        }} />
      </div>
    );
  }

  if (status === 'unauth') {
    return <Navigate to="/login" replace />;
  }

  if (status === 'denied') {
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
