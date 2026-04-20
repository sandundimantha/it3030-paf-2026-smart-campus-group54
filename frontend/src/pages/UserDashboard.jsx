import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { incidentService } from '../services/incidentService';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  AlertTriangle, 
  Bell, 
  ArrowRight,
  PlusCircle,
  LayoutDashboard
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './UserDashboard.css';

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    bookings: [],
    incidents: [],
    notifications: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [bookings, incidents, notifications] = await Promise.all([
          bookingService.getUserBookings(),
          incidentService.getUserIncidents(),
          notificationService.getUserNotifications()
        ]);
        setStats({ bookings, incidents, notifications, loading: false, error: null });
      } catch (err) {
        console.error(err);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    fetchUserData();
  }, []);

  const activeIncidents = stats.incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED');

  if (stats.loading) return <div className="loading-state"><div className="loader-ring"></div></div>;

  return (
    <div className="dashboard-container">
      {/* Welcome Header */}
      <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>
            Welcome, {user?.name || user?.email.split('@')[0]} 👋
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
            Seamlessly book lecture halls and manage your campus experience perfectly.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/create-booking" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600 }}>
            <PlusCircle size={18} /> New Request
          </Link>
          <Link to="/maintenance-hub" className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', backgroundColor: '#ef4444', color: 'white', textDecoration: 'none', fontWeight: 600 }}>
            <AlertTriangle size={18} /> Maintenance
          </Link>
        </div>
      </header>

      {/* Primary User Stats Grid */}
      <div className="stats-grid" style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem'
      }}>
        <div className="stat-card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', width: '56px', height: '56px', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Calendar size={28}/>
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.2rem 0', color: '#0f172a' }}>{stats.bookings.length}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>My Bookings</p>
          </div>
        </div>

        <div className="stat-card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', width: '56px', height: '56px', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Bell size={28}/>
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.2rem 0', color: '#0f172a' }}>{stats.notifications.length}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Notifications</p>
          </div>
        </div>

        <div className="stat-card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', width: '56px', height: '56px', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <AlertTriangle size={28}/>
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.2rem 0', color: '#0f172a' }}>{activeIncidents.length}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>My Active Issues</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2rem' }}>
        <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Recent Activities</h2>
            <Link to="/my-bookings" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
              Full History <ArrowRight size={14}/>
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.bookings.slice(0, 3).map(booking => (
              <div key={booking.id} style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                <div style={{ 
                  width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0, marginRight: '1rem',
                  backgroundColor: booking.status === 'APPROVED' ? '#10b981' : booking.status === 'REJECTED' ? '#ef4444' : '#f59e0b'
                }}></div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.2rem 0', color: '#0f172a' }}>Booking #{booking.id} - Resource: {booking.resourceId}</h4>
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{new Date(booking.startTime).toLocaleString()}</span>
                </div>
              </div>
            ))}
            {stats.bookings.length === 0 && <p style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>No recent activity detected.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
