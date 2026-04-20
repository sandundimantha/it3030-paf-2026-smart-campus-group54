import React, { useState, useEffect, useMemo } from 'react';
import { bookingService } from '../services/bookingService';
import { incidentService } from '../services/incidentService';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  AlertCircle, 
  Users,
  ShieldCheck,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowRight,
  ShieldAlert,
  ServerCrash
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';

import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    bookings: [],
    incidents: [],
    users: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [bookings, incidents, usersData] = await Promise.all([
          bookingService.getAllBookings().catch(() => []),
          incidentService.getAllIncidents().catch(() => []),
          userService.getAllUsers().catch(() => [])
        ]);

        setStats({ bookings, incidents, users: usersData, loading: false, error: null });
      } catch (err) {
        console.error(err);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    fetchAdminData();
  }, []);

  const activityChartData = useMemo(() => {
    if (!stats.bookings || stats.bookings.length === 0) return [];
    const grouped = {};
    stats.bookings.forEach(b => {
      if (!b.startTime) return;
      const dateStr = new Date(b.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      grouped[dateStr] = (grouped[dateStr] || 0) + 1;
    });
    return Object.keys(grouped).map(k => ({ name: k, count: grouped[k] })).slice(-7);
  }, [stats.bookings]);

  const statusPieData = useMemo(() => {
    let pending = 0, approved = 0, rejected = 0;
    stats.bookings.forEach(b => {
      if(b.status === 'PENDING') pending++;
      else if(b.status === 'APPROVED') approved++;
      else if(b.status === 'REJECTED') rejected++;
    });
    return [
      { name: 'Approved', value: approved, color: '#10b981' },
      { name: 'Pending', value: pending, color: '#f59e0b' },
      { name: 'Rejected', value: rejected, color: '#ef4444' }
    ].filter(d => d.value > 0);
  }, [stats.bookings]);

  const activeIncidents = stats.incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED');
  const pendingApprovals = stats.bookings.filter(b => b.status === 'PENDING');

  if (stats.loading) return <div className="loading-state"><div className="loader-ring"></div></div>;

  return (
    <div className="admin-dashboard-container animate-fade-in-up">
      {/* Header */}
      <header className="admin-header stagger-1">
        <div>
          <h1 className="welcome-title">Command Center</h1>
          <p className="subtitle">Welcome back, {user?.name || 'Administrator'}. Here is your global system overview.</p>
        </div>
      </header>

      {/* Quick Jump Action Grid (Unique to Admin) */}
      <div className="quick-action-grid stagger-2">
        <button onClick={() => navigate('/admin')} className="action-tile pending-tile">
          <div className="tile-icon"><ShieldAlert size={32} /></div>
          <div className="tile-content">
            <h3>{pendingApprovals.length} Pending</h3>
            <p>Review Booking Requests</p>
          </div>
        </button>
        <button onClick={() => navigate('/admin/users')} className="action-tile users-tile">
          <div className="tile-icon"><Users size={32} /></div>
          <div className="tile-content">
            <h3>Directory</h3>
            <p>Manage Roles & Access</p>
          </div>
        </button>
        <button onClick={() => navigate('/admin/facilities')} className="action-tile facilities-tile">
          <div className="tile-icon"><ServerCrash size={32} /></div>
          <div className="tile-content">
            <h3>Facilities</h3>
            <p>System Infrastructure</p>
          </div>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid stagger-3">
        <div className="admin-stat-card interactive-stat" onClick={() => navigate('/admin/users')} title="Click to view all users">
          <div className="stat-icon users-bg"><Users size={28}/></div>
          <div className="stat-info">
            <h3>{stats.users.length}</h3>
            <p>Total Registered Users</p>
          </div>
        </div>
        <div className="admin-stat-card interactive-stat" onClick={() => navigate('/admin')} title="Click to view all booking requests">
          <div className="stat-icon bookings"><Calendar size={28}/></div>
          <div className="stat-info">
             <h3>{stats.bookings.length}</h3>
             <p>Total Processed Bookings</p>
          </div>
        </div>
        <div className="admin-stat-card interactive-stat" onClick={() => navigate('/maintenance-hub')} title="Click to view system incidents">
          <div className="stat-icon instances">
            {activeIncidents.length > 0 ? <AlertCircle size={28} className="pulse-alert" /> : <ShieldCheck size={28}/>}
          </div>
          <div className="stat-info">
            <h3>{activeIncidents.length}</h3>
            <p>Active System Incidents</p>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-content stagger-4">
        {/* Charts Section */}
        <div className="charts-wrapper">
          <section className="admin-card">
            <div className="section-header">
              <div className="header-title">
                 <BarChart3 size={20} className="text-primary"/>
                 <h2>System Engagement Pipeline</h2>
              </div>
            </div>
            {activityChartData.length === 0 ? (
              <div className="empty-chart">Awaiting telemetry data.</div>
            ) : (
              <div className="chart-container-wrapper">
                 <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                    <BarChart data={activityChartData} margin={{top: 20}}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis hide />
                      <Tooltip cursor={{fill: 'rgba(226, 232, 240, 0.4)'}} contentStyle={{borderRadius:'8px', border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}/>
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
                        {activityChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === activityChartData.length - 1 ? '#4f46e5' : '#94a3b8'} />
                        ))}
                      </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
            )}
          </section>

          <section className="admin-card">
            <div className="section-header">
              <div className="header-title">
                 <PieChartIcon size={20} className="text-secondary"/>
                 <h2>Approval Distribution</h2>
              </div>
            </div>
            <div className="chart-container-wrapper">
              {statusPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                  <PieChart>
                    <Pie data={statusPieData} cx="50%" cy="45%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none">
                      {statusPieData.map((entry, idx) => (<Cell key={`cell-${idx}`} fill={entry.color} />))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius:'8px', border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div className="empty-chart">No distribution data</div>}
            </div>
          </section>
        </div>

        {/* Live Feed */}
        <section className="admin-card live-feed-section stagger-5">
          <div className="section-header">
            <h2>Live Request Feed</h2>
            <Link to="/admin" className="view-all">Open Control Panel <ArrowRight size={14}/></Link>
          </div>
          <div className="list-container">
            {stats.bookings.slice(0, 4).map(booking => (
              <div key={booking.id} className="live-feed-item">
                <div className={`status-dot ${booking.status.toLowerCase()}`}></div>
                <div className="item-details flex-row">
                  <div>
                    <h4>Resource ID: {booking.resourceId}</h4>
                    <span className="text-muted">Requested by User {booking.userId}</span>
                  </div>
                  <span className={`pill ${booking.status.toLowerCase()}`}>{booking.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
