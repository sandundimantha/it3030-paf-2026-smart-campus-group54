import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
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
import './App.css';
import { Calendar, LayoutDashboard, AlertTriangle } from 'lucide-react';

function Navigation() {
  const location = useLocation();

  if (location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary-color)' }}>
          <Calendar />
          Smart Campus Hub
        </div>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Dashboard</Link>
          <Link to="/create-booking" className={`nav-link ${location.pathname === '/create-booking' ? 'active' : ''}`}>Book Resource</Link>
          <Link to="/report-incident" className={`nav-link ${location.pathname === '/report-incident' ? 'active' : ''}`}>Report Incident</Link>
          <Link to="/my-bookings" className={`nav-link ${location.pathname === '/my-bookings' ? 'active' : ''}`}>My Bookings</Link>
          <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>Admin Approval</Link>
          <Link to="/notifications" className={`nav-link ${location.pathname === '/notifications' ? 'active' : ''}`}>Notifications</Link>
          <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>Profile</Link>
          <Link to="/admin/users" className={`nav-link ${location.pathname === '/admin/users' ? 'active' : ''}`}>Manage Users</Link>
          <NotificationPanel />
        </div>
      </div>
    </nav>
  );
}

function WelcomePage() {
  return (
    <div className="container animate-fade-in" style={{ marginTop: '3rem', textAlign: 'center' }}>
      <LayoutDashboard size={48} color="var(--primary-color)" style={{ margin: '0 auto 1.5rem' }} />
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome to Smart Campus Hub</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
        Seamlessly book lecture halls, lab equipment, and other campus resources.
        Track your bookings and manage your campus experience perfectly.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/create-booking" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
          Get Started
        </Link>
        <Link to="/report-incident" className="btn btn-danger" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={18} /> Report Issue
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-booking" element={<CreateBookingPage />} />
            <Route path="/report-incident" element={<ReportIncidentPage />} />
            <Route path="/my-bookings" element={<UserBookingsPage />} />
            <Route path="/admin" element={<AdminApprovalPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
