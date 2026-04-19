import React, { useEffect, useState } from 'react';
import userService from '../services/userService';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    userService.getMyProfile()
      .then(data => setUser(data))
      .catch(() => setError('Failed to load profile. Please log in again.'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    window.location.href = 'http://localhost:8080/api/auth/logout';
  };

  if (loading) return <div style={styles.center}><div style={styles.spinner}></div></div>;
  if (error) return <div style={styles.center}><p style={{ color: '#fc8181' }}>{error}</p></div>;

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Profile Picture */}
        <div style={styles.avatarWrapper}>
          {user.pictureUrl ? (
            <img src={user.pictureUrl} alt="Profile" style={styles.avatar} />
          ) : (
            <div style={styles.avatarFallback}>
              {user.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
        </div>

        {/* Name + Email */}
        <h1 style={styles.name}>{user.name}</h1>
        <p style={styles.email}>{user.email}</p>

        {/* Role Badge */}
        <span style={{ ...styles.badge, ...(isAdmin ? styles.badgeAdmin : styles.badgeUser) }}>
          {isAdmin ? '🛡️ Administrator' : '👤 User'}
        </span>

        <div style={styles.divider} />

        {/* Info Grid */}
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Member Since</span>
            <span style={styles.infoValue}>
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              }) : 'N/A'}
            </span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Account Type</span>
            <span style={styles.infoValue}>{user.role}</span>
          </div>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div style={styles.adminSection}>
            <p style={styles.adminLabel}>Admin Actions</p>
            <a href="/admin/users" style={styles.adminLink}>
              👥 Manage Users & Roles
            </a>
          </div>
        )}

        {/* Logout Button */}
        <button onClick={handleLogout} style={styles.logoutBtn}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c53030'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#e53e3e'}
        >
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
}

const styles = {
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' },
  spinner: {
    width: '40px', height: '40px',
    border: '4px solid rgba(255,255,255,0.1)',
    borderTop: '4px solid #4285f4',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
    minHeight: '80vh', padding: '2rem',
  },
  card: {
    background: 'var(--card-bg, #1e293b)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '1.5rem',
    padding: '2.5rem',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    marginTop: '2rem',
  },
  avatarWrapper: { marginBottom: '1.25rem' },
  avatar: {
    width: '100px', height: '100px',
    borderRadius: '50%',
    border: '3px solid #4285f4',
    objectFit: 'cover',
  },
  avatarFallback: {
    width: '100px', height: '100px',
    borderRadius: '50%',
    backgroundColor: '#4285f4',
    color: 'white',
    fontSize: '2.5rem',
    fontWeight: '700',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto',
  },
  name: { color: '#fff', fontSize: '1.75rem', fontWeight: '700', margin: '0 0 0.25rem 0' },
  email: { color: '#94a3b8', fontSize: '0.95rem', margin: '0 0 1rem 0' },
  badge: {
    display: 'inline-block',
    padding: '0.35rem 1rem',
    borderRadius: '99px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  badgeAdmin: { backgroundColor: 'rgba(59,130,246,0.2)', color: '#60a5fa', border: '1px solid #3b82f6' },
  badgeUser: { backgroundColor: 'rgba(34,197,94,0.2)', color: '#4ade80', border: '1px solid #22c55e' },
  divider: { height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '1.5rem 0' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
  infoItem: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  infoLabel: { color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  infoValue: { color: '#e2e8f0', fontSize: '0.95rem', fontWeight: '500' },
  adminSection: {
    backgroundColor: 'rgba(59,130,246,0.08)',
    border: '1px solid rgba(59,130,246,0.2)',
    borderRadius: '0.75rem',
    padding: '1rem',
    marginBottom: '1.5rem',
  },
  adminLabel: { color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', margin: '0 0 0.5rem 0' },
  adminLink: {
    color: '#60a5fa',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  logoutBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};
