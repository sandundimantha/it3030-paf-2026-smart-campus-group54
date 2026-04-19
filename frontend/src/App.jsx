import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import CreateBookingPage from './pages/CreateBookingPage';
import UserBookingsPage from './pages/UserBookingsPage';
import AdminApprovalPage from './pages/AdminApprovalPage';
import ReportIncidentPage from './pages/ReportIncidentPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import NotificationPanel from './components/NotificationPanel';
import FacilitiesPage from './pages/FacilitiesPage';
import FacilityList from './pages/FacilityList';
import MaintenanceDashboard from './pages/MaintenanceDashboard';
import DashboardPage from './pages/DashboardPage';
import './App.css';
import './pages/DashboardPage.css';
import { Calendar, LayoutDashboard, AlertTriangle, LogOut, User } from 'lucide-react';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  if (location.pathname === '/login') return null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary-color)' }}>
          <Calendar />
          Smart Campus Hub
        </div>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Dashboard</Link>
          <Link to="/create-booking" className={`nav-link ${location.pathname === '/create-booking' ? 'active' : ''}`}>Book Resource</Link>
          <Link to="/maintenance-hub" className={`nav-link ${location.pathname === '/maintenance-hub' ? 'active' : ''}`}>Maintenance Hub</Link>
          <Link to="/facilities" className={`nav-link ${location.pathname === '/facilities' ? 'active' : ''}`}>Facilities</Link>
          {isAdmin && (
            <>
              <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>Approvals</Link>
              <Link to="/admin/users" className={`nav-link ${location.pathname === '/admin/users' ? 'active' : ''}`}>Users</Link>
              <Link to="/admin/facilities" className={`nav-link ${location.pathname === '/admin/facilities' ? 'active' : ''}`}>Manage Facilities</Link>
            </>
          )}
          <NotificationPanel />

          {/* User info + logout */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>
                <User size={16} />
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name || user.email}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '0.4rem', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" style={{ color: '#60a5fa', fontSize: '0.875rem' }}>Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function WelcomePage() {
  const { user } = useAuth();
  return (
    <div className="container animate-fade-in" style={{ marginTop: '3rem', textAlign: 'center' }}>
      <LayoutDashboard size={48} color="var(--primary-color)" style={{ margin: '0 auto 1.5rem' }} />
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Welcome{user ? `, ${user.name || user.email.split('@')[0]}` : ''} 👋
      </h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
        Seamlessly book lecture halls, lab equipment, and other campus resources.
        Track your bookings and manage your campus experience perfectly.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/create-booking" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
          Get Started
        </Link>
        <Link to="/maintenance-hub" className="btn btn-danger" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={18} /> Maintenance Hub
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/create-booking" element={<CreateBookingPage />} />
              <Route path="/maintenance-hub" element={<ProtectedRoute><MaintenanceDashboard /></ProtectedRoute>} />
              <Route path="/report-incident" element={<ProtectedRoute><ReportIncidentPage /></ProtectedRoute>} />
              <Route path="/my-bookings" element={<UserBookingsPage />} />
              <Route path="/admin" element={<AdminApprovalPage />} />
              <Route path="/facilities" element={<FacilityList />} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
              <Route path="/admin/facilities" element={<AdminRoute><FacilitiesPage /></AdminRoute>} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
