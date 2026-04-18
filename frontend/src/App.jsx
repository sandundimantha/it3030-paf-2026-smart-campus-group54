import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import AdminUsersPage from './pages/AdminUsersPage';

// Notification bell icon (inline)
import notificationService from './services/notificationService';
import userService from './services/userService';

import './App.css';

// ─── Notification Bell Component ────────────────────────────────────────────
function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const load = () => {
      notificationService.getUnreadCount()
        .then(n => setCount(n))
        .catch(() => {});
    };
    load();
    const interval = setInterval(load, 30000); // refresh every 30 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <Link to="/notifications" style={{ position: 'relative', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
      <span style={{ fontSize: '1.4rem' }}>🔔</span>
      {count > 0 && (
        <span style={{
          position: 'absolute', top: '-6px', right: '-8px',
          backgroundColor: '#ef4444', color: 'white',
          borderRadius: '50%', padding: '1px 5px',
          fontSize: '0.7rem', fontWeight: 'bold', minWidth: '18px', textAlign: 'center'
        }}>
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  );
}

// ─── Navigation Component ───────────────────────────────────────────────────
function Navigation() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    userService.getMyProfile()
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const isActive = (path) => location.pathname === path;

  // Don't show navbar on login page
  if (location.pathname === '/login') return null;

  return (
    <nav style={navStyles.nav}>
      <div style={navStyles.inner}>
        {/* Logo */}
        <Link to="/" style={navStyles.logo}>
          🏛️ Smart Campus Hub
        </Link>

        {/* Nav Links */}
        <div style={navStyles.links}>
          <Link to="/" style={{ ...navStyles.link, ...(isActive('/') ? navStyles.linkActive : {}) }}>
            Dashboard
          </Link>

          {user && (
            <>
              <Link to="/notifications" style={{ ...navStyles.link, ...(isActive('/notifications') ? navStyles.linkActive : {}) }}>
                Notifications
              </Link>
              <Link to="/profile" style={{ ...navStyles.link, ...(isActive('/profile') ? navStyles.linkActive : {}) }}>
                Profile
              </Link>
              {user.role === 'ADMIN' && (
                <Link to="/admin/users" style={{ ...navStyles.link, ...(isActive('/admin/users') ? navStyles.linkActive : {}) }}>
                  Manage Users
                </Link>
              )}
            </>
          )}
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              <NotificationBell />
              {user.pictureUrl ? (
                <Link to="/profile">
                  <img src={user.pictureUrl} alt="Profile"
                    style={{ width: '34px', height: '34px', borderRadius: '50%', border: '2px solid #4285f4', cursor: 'pointer' }} />
                </Link>
              ) : (
                <Link to="/profile" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>
                  {user.name || 'Profile'}
                </Link>
              )}
            </>
          ) : (
            <Link to="/login" style={navStyles.loginBtn}>Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

const navStyles = {
  nav: {
    backgroundColor: 'rgba(15,23,42,0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    position: 'sticky', top: 0, zIndex: 100,
    padding: '0 1.5rem',
  },
  inner: {
    maxWidth: '1200px', margin: '0 auto',
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
  },
  logo: {
    color: '#60a5fa', fontWeight: '700', fontSize: '1.1rem',
    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem',
  },
  links: { display: 'flex', gap: '0.25rem' },
  link: {
    color: '#94a3b8', textDecoration: 'none',
    padding: '0.4rem 0.75rem', borderRadius: '0.5rem',
    fontSize: '0.9rem', fontWeight: '500',
    transition: 'all 0.2s',
  },
  linkActive: {
    color: '#60a5fa',
    backgroundColor: 'rgba(59,130,246,0.1)',
  },
  loginBtn: {
    color: '#60a5fa',
    border: '1px solid #3b82f6',
    backgroundColor: 'rgba(59,130,246,0.1)',
    padding: '0.4rem 1rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
};

// ─── Welcome / Dashboard Page ────────────────────────────────────────────────
function WelcomePage() {
  return (
    <div style={{ maxWidth: '700px', margin: '4rem auto', textAlign: 'center', padding: '0 1rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏛️</div>
      <h1 style={{ color: '#f1f5f9', fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
        Welcome to Smart Campus Hub
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.7', marginBottom: '2rem' }}>
        Seamlessly book lecture halls, lab equipment, and campus resources.
        Report incidents, track tickets, and stay notified in real-time.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/login" style={{
          padding: '0.75rem 2rem', backgroundColor: '#4285f4', color: 'white',
          borderRadius: '0.75rem', textDecoration: 'none', fontWeight: '600',
        }}>
          Get Started →
        </Link>
        <Link to="/notifications" style={{
          padding: '0.75rem 2rem',
          backgroundColor: 'rgba(255,255,255,0.05)',
          color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '0.75rem', textDecoration: 'none', fontWeight: '500',
        }}>
          🔔 Notifications
        </Link>
      </div>
    </div>
  );
}

// ─── App Root ────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <Navigation />
        <main>
          <Routes>
            {/* Public */}
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected — requires login */}
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute><NotificationsPage /></ProtectedRoute>
            } />

            {/* Admin only */}
            <Route path="/admin/users" element={
              <AdminRoute><AdminUsersPage /></AdminRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
