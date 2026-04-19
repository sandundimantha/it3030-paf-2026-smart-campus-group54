import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { Bell, Check, Clock } from 'lucide-react';

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getUserNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const togglePanel = () => {
    if (!isOpen) {
      fetchNotifications(); // Also fetch on click as requested
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      // Locally update state to avoid full re-fetch overhead
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={togglePanel} 
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          position: 'relative',
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Bell color="var(--text-muted)" size={24} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '0',
            right: '0',
            backgroundColor: 'var(--danger-color)',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '0.7rem',
            fontWeight: 'bold'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '0',
          width: '320px',
          maxHeight: '400px',
          overflowY: 'auto',
          backgroundColor: 'var(--card-bg)',
          boxShadow: 'var(--shadow-lg)',
          borderRadius: '0.5rem',
          border: '1px solid var(--border-color)',
          zIndex: 50,
          marginTop: '0.5rem'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: '600' }}>
            Notifications
          </div>
          
          {notifications.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              You're all caught up!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {notifications.map(n => (
                <div 
                  key={n.id} 
                  style={{ 
                    padding: '1rem', 
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: n.read ? 'transparent' : '#f0fdf4',
                    transition: 'background-color 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    {n.message}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> {new Date(n.createdAt).toLocaleString()}
                    </span>
                    {!n.read && (
                      <button 
                        onClick={() => handleMarkAsRead(n.id)}
                        className="btn"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }}
                      >
                        <Check size={12} style={{ marginRight: '4px' }}/> Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
