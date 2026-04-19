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

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    bookings: [],
    incidents: [],
    notifications: [],
    facilities: [],
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
    if (!stats.bookings || !stats.bookings.length) return [];
    
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
      if (!booking.startTime) return;
      const bookingDate = booking.startTime.split('T')[0];
      const dayMatch = last7Days.find(d => d.date === bookingDate);
      if (dayMatch) {
        dayMatch.count += 1;
      }
    });

    return last7Days;
  }, [stats.bookings]);

  const activeIncidents = stats.incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED');
  const pendingApprovals = stats.bookings.filter(b => b.status === 'PENDING');

  if (stats.loading) return <div className="loading-state">Initializing Hub...</div>;

  return (
    <div className="dashboard-container">
      {/* Welcome Header */}
      <header className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name || user?.email.split('@')[0]} 👋</h1>
          <p>{isAdmin ? 'Manage global campus operations and approvals.' : 'Your campus activities at a glance.'}</p>
        </div>
        <div className="header-actions">
          {isAdmin ? (
             <Link to="/admin" className="btn btn-primary">
                Review {pendingApprovals.length} Pending
             </Link>
          ) : (
            <Link to="/create-booking" className="btn btn-primary">
              <PlusCircle size={18} /> New Booking
            </Link>
          )}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bookings"><Calendar /></div>
          <div className="stat-info">
            <h3>{stats.bookings.length}</h3>
            <p>{isAdmin ? 'Global Bookings' : 'My Bookings'}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon instances"><AlertCircle /></div>
          <div className="stat-info">
            <h3>{activeIncidents.length}</h3>
            <p>{isAdmin ? 'Active System Alerts' : 'My Active Issues'}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon notifications"><Bell /></div>
          <div className="stat-info">
            <h3>{stats.notifications.length}</h3>
            <p>New Notifications</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon locations"><MapPin /></div>
          <div className="stat-info">
            <h3>{isAdmin ? 'Management' : 'User Control'}</h3>
            <p>{isAdmin ? 'Admin Console' : 'Personal Hub'}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Module B: Booking Chart Integrated */}
        <section className="dashboard-section chart-section">
          <div className="section-header">
            <h2><BarChart3 size={20} /> Booking Insights</h2>
            <div style={{fontSize: '0.8rem', color: '#64748b'}}>Past 7 Days Engagement</div>
          </div>
          <div className="chart-container-wrapper">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: 'rgba(226, 232, 240, 0.4)'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={24}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 6 ? '#4f46e5' : '#818cf8'} />
                    ))}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        </section>

        {/* Module C: Recent Activity */}
        <div className="activity-lists">
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Recent Activities</h2>
              <Link to="/my-bookings" className="view-all">Full History <ArrowRight size={14}/></Link>
            </div>
            <div className="list-container">
              {stats.bookings.slice(0, 3).map(booking => (
                <div key={booking.id} className="list-item">
                  <div className={`status-badge ${booking.status.toLowerCase()}`}></div>
                  <div className="item-details">
                    <h4>{booking.resourceName || `Ref: #${booking.id}`}</h4>
                    <span>{new Date(booking.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                </div>
              ))}
              {stats.bookings.length === 0 && <p className="empty-msg">No recent activity detected.</p>}
            </div>
          </section>

          <section className="dashboard-section">
            <div className="section-header">
              <h2>Incident Watch</h2>
              <Link to="/report-incident" className="view-all">Report Issue <ArrowRight size={14}/></Link>
            </div>
            <div className="list-container">
              {stats.incidents.slice(0, 3).map(incident => (
                <div key={incident.id} className="list-item">
                  <div className={`priority-indicator ${incident.priority?.toLowerCase() || 'medium'}`}></div>
                  <div className="item-details">
                    <h4>{incident.title}</h4>
                    <span>Status: {incident.status}</span>
                  </div>
                </div>
              ))}
              {stats.incidents.length === 0 && <p className="empty-msg">Smart Campus is currently healthy.</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
