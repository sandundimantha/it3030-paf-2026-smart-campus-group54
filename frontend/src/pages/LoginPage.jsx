import React from 'react';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // Redirect to Spring Boot OAuth2 authorization URL
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo / Icon */}
        <div style={styles.iconWrapper}>
          <span style={styles.icon}>🏛️</span>
        </div>

        <h1 style={styles.title}>Smart Campus Hub</h1>
        <p style={styles.subtitle}>
          University Operations Platform
        </p>
        <p style={styles.description}>
          Sign in with your Google account to book facilities,
          manage incidents, and stay updated.
        </p>

        <button
          onClick={handleGoogleLogin}
          style={styles.googleButton}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#357ae8'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4285f4'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '10px' }}>
            <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        {window.location.search.includes('error') && (
          <div style={styles.errorBanner}>
            ⚠️ Login failed. Please try again.
          </div>
        )}

        <p style={styles.footer}>
          By signing in, you agree to the university's terms of service.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    padding: '2rem',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '1.5rem',
    padding: '3rem 2.5rem',
    maxWidth: '420px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
  },
  iconWrapper: {
    marginBottom: '1.5rem',
  },
  icon: {
    fontSize: '4rem',
  },
  title: {
    color: '#ffffff',
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    color: '#a0aec0',
    fontSize: '0.875rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '1.5rem',
  },
  description: {
    color: '#cbd5e0',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  googleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '0.875rem 1.5rem',
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    marginBottom: '1.5rem',
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#fc8181',
    borderRadius: '0.5rem',
    padding: '0.75rem',
    marginBottom: '1rem',
    fontSize: '0.875rem',
  },
  footer: {
    color: '#718096',
    fontSize: '0.75rem',
    marginTop: '1rem',
  },
};
