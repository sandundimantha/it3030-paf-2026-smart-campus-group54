import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ email: '', name: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleLogin = async e => {
    e.preventDefault();
    setError('');

    // Pre-flight frontend validation
    if (!form.email || !form.password) {
      setError('Please fill in both email and password.');
      return;
    }
    if (!validateEmail(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    setError('');

    // Pre-flight frontend validation for registration
    if (!form.name || form.name.trim().length < 3) {
      setError('Full Name must be at least 3 characters long.');
      return;
    }
    if (!validateEmail(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const { register } = await import('../context/AuthContext').then(m => {
        // Use the hook directly (we already have register via context in parent)
        return { register: null };
      });
      // Import api directly for register
      const api = (await import('../services/api')).default;
      await api.post('/auth/register', {
        email: form.email.trim(),
        name: form.name.trim(),
        password: form.password,
      });
      // Auto-login after successful registration
      await login(form.email.trim(), form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.iconWrapper}>🏛️</div>
        <h1 style={styles.title}>Smart Campus Hub</h1>
        <p style={styles.subtitle}>University Operations Platform</p>

        {/* Tab switcher */}
        <div style={styles.tabRow}>
          <button
            style={{ ...styles.tab, ...(tab === 'login' ? styles.tabActive : {}) }}
            onClick={() => { setTab('login'); setError(''); }}
          >
            Sign In
          </button>
          <button
            style={{ ...styles.tab, ...(tab === 'register' ? styles.tabActive : {}) }}
            onClick={() => { setTab('register'); setError(''); }}
          >
            Register
          </button>
        </div>

        {/* Error banner */}
        {error && <div style={styles.errorBanner}>⚠️ {error}</div>}

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@university.edu"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Full Name"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@university.edu"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                required
                minLength={6}
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>
        )}

        {/* OAuth2 reference (preserved for demonstration) */}
        <div style={styles.divider}>
          <span style={styles.dividerText}>or</span>
        </div>
        <button
          onClick={() => window.location.href = 'http://localhost:8081/oauth2/authorization/google'}
          style={styles.googleButton}
          title="OAuth2 — requires Google credentials configured in application.properties"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
            <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google (Demo)
        </button>

        <p style={styles.footer}>By signing in, you agree to the university's terms of service.</p>
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
    padding: '2.5rem 2.5rem',
    maxWidth: '440px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
  },
  iconWrapper: { fontSize: '3.5rem', marginBottom: '1rem' },
  title: { color: '#ffffff', fontSize: '1.8rem', fontWeight: '700', margin: '0 0 0.25rem' },
  subtitle: { color: '#a0aec0', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem' },
  tabRow: { display: 'flex', marginBottom: '1.5rem', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' },
  tab: { flex: 1, padding: '0.6rem', background: 'transparent', border: 'none', color: '#a0aec0', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500', transition: 'all 0.2s' },
  tabActive: { background: 'rgba(66,133,244,0.2)', color: '#60a5fa' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { color: '#cbd5e0', fontSize: '0.85rem', fontWeight: '500' },
  input: {
    padding: '0.7rem 1rem',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '0.5rem',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
  },
  submitButton: {
    marginTop: '0.5rem',
    padding: '0.8rem',
    background: 'linear-gradient(135deg, #4285f4, #2563eb)',
    color: 'white',
    border: 'none',
    borderRadius: '0.6rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  errorBanner: {
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#fc8181',
    borderRadius: '0.5rem',
    padding: '0.7rem',
    marginBottom: '1rem',
    fontSize: '0.875rem',
  },
  divider: { display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: '0.75rem' },
  dividerText: { color: '#4a5568', fontSize: '0.8rem', whiteSpace: 'nowrap' },
  googleButton: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '100%', padding: '0.75rem',
    background: 'rgba(66,133,244,0.1)',
    border: '1px solid rgba(66,133,244,0.3)',
    color: '#93c5fd', borderRadius: '0.6rem',
    fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer',
    marginBottom: '1rem',
  },
  footer: { color: '#4a5568', fontSize: '0.72rem', marginTop: '0.5rem' },
};
