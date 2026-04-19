import React, { useEffect, useState } from 'react';
import notificationService from '../services/notificationService';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getUserNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const handleMarkAllRead = async () => {
    setActionLoading(true);
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  };

  const filtered = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const typeColors = {
    BOOKING_APPROVED: { bg: 'rgba(34,197,94,0.1)', border: '#22c55e', icon: '✅', label: 'Booking Approved' },
    BOOKING_REJECTED: { bg: 'rgba(239,68,68,0.1)', border: '#ef4444', icon: '❌', label: 'Booking Rejected' },
    BOOKING_CANCELLED: { bg: 'rgba(234,179,8,0.1)', border: '#eab308', icon: '🚫', label: 'Booking Cancelled' },
    TICKET_STATUS_CHANGED: { bg: 'rgba(168,85,247,0.1)', border: '#a855f7', icon: '🔧', label: 'Ticket Updated' },
    NEW_COMMENT: { bg: 'rgba(59,130,246,0.1)', border: '#3b82f6', icon: '💬', label: 'New Comment' },
    GENERAL: { bg: 'rgba(100,116,139,0.1)', border: '#64748b', icon: '🔔', label: 'Notification' },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🔔 Notifications</h1>
          <p style={styles.subtitle}>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={actionLoading}
            style={styles.markAllBtn}
          >
            {actionLoading ? 'Marking...' : '✓ Mark All Read'}
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setFilter('all')}
          style={{ ...styles.tab, ...(filter === 'all' ? styles.tabActive : {}) }}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          style={{ ...styles.tab, ...(filter === 'unread' ? styles.tabActive : {}) }}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      {loading ? (
        <div style={styles.empty}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={styles.emptyCard}>
          <span style={{ fontSize: '3rem' }}>🎉</span>
          <p style={{ color: '#94a3b8', marginTop: '1rem' }}>
            {filter === 'unread' ? 'No unread notifications!' : 'No notifications yet.'}
          </p>
        </div>
      ) : (
        <div style={styles.list}>
          {filtered.map(n => {
            const typeInfo = typeColors[n.type] || typeColors.GENERAL;
            return (
              <div
                key={n.id}
                style={{
                  ...styles.item,
                  backgroundColor: n.read ? 'transparent' : typeInfo.bg,
                  borderLeft: `4px solid ${n.read ? '#334155' : typeInfo.border}`,
                  opacity: n.read ? 0.7 : 1,
                }}
              >
                <div style={styles.itemIcon}>{typeInfo.icon}</div>
                <div style={styles.itemContent}>
                  <div style={styles.itemType}>{typeInfo.label}</div>
                  <div style={styles.itemMessage}>{n.message}</div>
                  <div style={styles.itemTime}>
                    🕐 {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
                <div style={styles.itemActions}>
                  {!n.read && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      style={styles.readBtn}
                      title="Mark as read"
                    >
                      ✓ Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    style={styles.deleteBtn}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '1.5rem',
  },
  title: { color: '#f1f5f9', fontSize: '1.75rem', fontWeight: '700', margin: '0 0 0.25rem 0' },
  subtitle: { color: '#64748b', fontSize: '0.9rem', margin: 0 },
  markAllBtn: {
    padding: '0.5rem 1.25rem',
    backgroundColor: 'rgba(34,197,94,0.15)',
    color: '#4ade80',
    border: '1px solid #22c55e',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.875rem',
  },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  tab: {
    padding: '0.5rem 1.25rem',
    borderRadius: '99px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'transparent',
    color: '#64748b',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  tabActive: {
    backgroundColor: 'rgba(59,130,246,0.2)',
    color: '#60a5fa',
    borderColor: '#3b82f6',
  },
  empty: { textAlign: 'center', color: '#64748b', padding: '3rem' },
  emptyCard: {
    textAlign: 'center', padding: '4rem 2rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '1rem',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  list: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  item: {
    display: 'flex', alignItems: 'flex-start', gap: '1rem',
    padding: '1.25rem',
    borderRadius: '0.75rem',
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'all 0.2s ease',
  },
  itemIcon: { fontSize: '1.5rem', flexShrink: 0, marginTop: '0.1rem' },
  itemContent: { flex: 1 },
  itemType: { color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' },
  itemMessage: { color: '#e2e8f0', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '0.5rem' },
  itemTime: { color: '#475569', fontSize: '0.8rem' },
  itemActions: { display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 },
  readBtn: {
    padding: '0.25rem 0.75rem',
    backgroundColor: 'rgba(34,197,94,0.15)',
    color: '#4ade80',
    border: '1px solid #22c55e',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  deleteBtn: {
    padding: '0.25rem 0.5rem',
    backgroundColor: 'rgba(239,68,68,0.1)',
    color: '#f87171',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};
