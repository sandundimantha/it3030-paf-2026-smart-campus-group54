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
          <Link to="/create-booking" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', borderRadius: '0.75rem', fontWeight: 700, transition: 'all 0.3s ease', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}>
            <Calendar size={20} /> Book a Facility
          </Link>
          <Link to="/report-incident" className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', borderRadius: '0.75rem', backgroundColor: '#ef4444', color: 'white', textDecoration: 'none', fontWeight: 700, transition: 'all 0.3s ease', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)' }}>
            <AlertTriangle size={20} /> Report New Incident
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
        {/* Bookings Section */}
        <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={20} color="#6366f1" /> My Booking History
            </h2>
            <Link to="/my-bookings" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
              Full Detail <ArrowRight size={14}/>
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.bookings.slice(0, 5).map(booking => (
              <div key={booking.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.15rem 0', color: '#334155', fontSize: '0.95rem' }}>Resource: {booking.resourceId}</h4>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500 }}>{new Date(booking.startTime).toLocaleDateString()} at {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <span style={{ 
                  padding: '0.3rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700,
                  backgroundColor: booking.status === 'APPROVED' ? '#dcfce7' : booking.status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
                  color: booking.status === 'APPROVED' ? '#166534' : booking.status === 'REJECTED' ? '#991b1b' : '#92400e',
                  border: `1px solid ${booking.status === 'APPROVED' ? '#bbf7d0' : booking.status === 'REJECTED' ? '#fecaca' : '#fde68a'}`
                }}>
                  {booking.status}
                </span>
              </div>
            ))}
            {stats.bookings.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                <Calendar size={32} style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
                <p>No capacity reserved yet.</p>
              </div>
            )}
          </div>
        </section>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Incidents Section */}
          <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertTriangle size={20} color="#ef4444" /> My Reported Incidents
              </h2>
              <Link to="/maintenance-hub" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                Track All <ArrowRight size={14}/>
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.incidents.slice(0, 3).map(incident => (
                <div key={incident.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff1f2', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #fecaca' }}>
                  <div style={{ flex: 1, paddingRight: '1rem' }}>
                    <h4 style={{ margin: '0 0 0.15rem 0', color: '#9f1239', fontSize: '0.95rem', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{incident.location || incident.category}</h4>
                    <span style={{ color: '#e11d48', fontSize: '0.8rem', opacity: 0.7 }}>Reported on {new Date(incident.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span style={{ 
                    padding: '0.3rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700,
                    backgroundColor: incident.status === 'RESOLVED' ? '#10b981' : incident.status === 'IN_PROGRESS' ? '#3b82f6' : '#ef4444',
                    color: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {incident.status}
                  </span>
                </div>
              ))}
              {stats.incidents.length === 0 && (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8' }}>
                  <p style={{ fontSize: '0.9rem' }}>Campus status is clear. No incidents reported.</p>
                </div>
              )}
            </div>
          </section>

          {/* Notifications Section */}
          <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Bell size={20} color="#f59e0b" /> Recent Notifications
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.notifications.slice(0, 4).map(notif => (
                <div key={notif.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: '#fffbeb', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #fef3c7' }}>
                  <div style={{ marginTop: '0.2rem', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: notif.read ? '#d1d5db' : '#f59e0b', flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#92400e', lineHeight: '1.4' }}>{notif.message}</p>
                    <span style={{ fontSize: '0.75rem', color: '#b45309', opacity: 0.8 }}>{new Date(notif.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {stats.notifications.length === 0 && (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8' }}>
                  <p style={{ fontSize: '0.9rem' }}>No new messages for you.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
