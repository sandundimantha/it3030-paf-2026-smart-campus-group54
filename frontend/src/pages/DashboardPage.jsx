import React, { useState, useEffect, useMemo } from 'react';
import { bookingService } from '../services/bookingService';
import { incidentService } from '../services/incidentService';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  AlertCircle, 
  Bell, 
  MapPin, 
  ArrowRight,
  PlusCircle,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    bookings: [],
    incidents: [],
    notifications: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchDashboardData();
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      
      const [bookings, incidents, notifications] = await Promise.all([
        isAdmin ? bookingService.getAllBookings() : bookingService.getUserBookings(),
        isAdmin ? incidentService.getAllIncidents() : incidentService.getUserIncidents(),
        notificationService.getUserNotifications()
      ]);

      setStats({
        bookings,
        incidents,
        notifications,
        loading: false,
        error: null
      });
    } catch (err) {
      setStats(prev => ({ ...prev, loading: false, error: 'Failed to load dashboard data' }));
      console.error(err);
    }
  };

  // Logic: Bookings per day for the last 7 days
  const chartData = useMemo(() => {
    if (!stats.bookings.length) return [];
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return {
        name: days[d.getDay()],
        date: d.toISOString().split('T')[0],
        count: 0
      };
    }).reverse();

    stats.bookings.forEach(booking => {
      const bookingDate = booking.startTime.split('T')[0];
      const dayMatch = last7Days.find(d => d.date === bookingDate);
      if (dayMatch) {
        dayMatch.count += 1;
      }
    });

    return last7Days;
  }, [stats.bookings]);

  const activeIncidents = stats.incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED');
  const pendingBookings = stats.bookings.filter(b => b.status === 'PENDING');

  if (stats.loading) return <div className="loading-state">Initializing Dashboard...</div>;

  return (
    <div className="dashboard-container">
      {/* Welcome Header */}
      <header className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name || user?.email.split('@')[0]} 👋</h1>
          <p>Here is what's happening on campus today.</p>
        </div>
        <div className="header-actions">
          <Link to="/create-booking" className="btn btn-primary">
            <PlusCircle size={18} /> New Booking
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bookings"><Calendar /></div>
          <div className="stat-info">
            <h3>{stats.bookings.length}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon instances"><AlertCircle /></div>
          <div className="stat-info">
            <h3>{activeIncidents.length}</h3>
            <p>Active Incidents</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon notifications"><Bell /></div>
          <div className="stat-info">
            <h3>{stats.notifications.length}</h3>
            <p>Notifications</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon locations"><MapPin /></div>
          <div className="stat-info">
            <h3>{isAdmin ? 'System wide' : 'User Access'}</h3>
            <p>{isAdmin ? 'Global Monitor' : 'Personal Activity'}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Module B: Booking Chart (Logic implemented, view placeholder for Part 2) */}
        <section className="dashboard-section chart-section">
          <div className="section-header">
            <h2><BarChart3 size={20} /> Booking Insights</h2>
            <span>Last 7 Days</span>
          </div>
          <div className="chart-placeholder">
            {/* Chart will be rendered here in Part 2 */}
            <p>Weekly booking data processed for {stats.bookings.length} records.</p>
          </div>
        </section>

        {/* Module C: Recent Activity */}
        <div className="activity-lists">
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Recent Bookings</h2>
              <Link to="/my-bookings" className="view-all">View All <ArrowRight size={14}/></Link>
            </div>
            <div className="list-container">
              {stats.bookings.slice(0, 3).map(booking => (
                <div key={booking.id} className="list-item">
                  <div className={`status-badge ${booking.status.toLowerCase()}`}></div>
                  <div className="item-details">
                    <h4>Facility ID: {booking.resourceId}</h4>
                    <span>{new Date(booking.startTime).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {stats.bookings.length === 0 && <p className="empty-msg">No bookings yet.</p>}
            </div>
          </section>

          <section className="dashboard-section">
            <div className="section-header">
              <h2>Incident Alerts</h2>
              <Link to="/report-incident" className="view-all">Report New <ArrowRight size={14}/></Link>
            </div>
            <div className="list-container">
              {stats.incidents.slice(0, 3).map(incident => (
                <div key={incident.id} className="list-item">
                  <div className={`priority-indicator ${incident.priority?.toLowerCase() || 'medium'}`}></div>
                  <div className="item-details">
                    <h4>{incident.title}</h4>
                    <span>{incident.status}</span>
                  </div>
                </div>
              ))}
              {stats.incidents.length === 0 && <p className="empty-msg">No incidents reported.</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
