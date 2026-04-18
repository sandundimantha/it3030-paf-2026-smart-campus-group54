import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CreateBookingPage from './pages/CreateBookingPage';
import UserBookingsPage from './pages/UserBookingsPage';
import AdminApprovalPage from './pages/AdminApprovalPage';
import './App.css';
import { Calendar, LayoutDashboard } from 'lucide-react';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="container nav-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary-color)' }}>
          <Calendar /> 
          Smart Campus Hub
        </div>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Dashboard
          </Link>
          <Link to="/create-booking" className={`nav-link ${location.pathname === '/create-booking' ? 'active' : ''}`}>
            Book Resource
          </Link>
          <Link to="/my-bookings" className={`nav-link ${location.pathname === '/my-bookings' ? 'active' : ''}`}>
            My Bookings
          </Link>
          <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
            Admin Approval
          </Link>
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
      <Link to="/create-booking" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
        Get Started
      </Link>
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
            <Route path="/create-booking" element={<CreateBookingPage />} />
            <Route path="/my-bookings" element={<UserBookingsPage />} />
            <Route path="/admin" element={<AdminApprovalPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
