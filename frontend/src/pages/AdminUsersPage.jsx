import React, { useEffect, useState } from 'react';
import userService from '../services/userService';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null); // userId being saved
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    userService.getAllUsers()
      .then(data => setUsers(data))
      .catch(() => setError('Failed to load users. You may not have Admin access.'))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = (userId, newRole) => {
    setUsers(prev =>
      prev.map(u => u.id === userId ? { ...u, role: newRole } : u)
    );
  };

  const handleSaveRole = async (userId, role) => {
    setSaving(userId);
    setSuccessMsg('');
    setError('');
    try {
      await userService.updateUserRole(userId, role);
      setSuccessMsg(`Role updated successfully for user #${userId}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to update role. Please try again.');
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div style={styles.center}><p style={{ color: '#94a3b8' }}>Loading users...</p></div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>👥 User Management</h1>
          <p style={styles.subtitle}>Manage user roles and access levels</p>
        </div>
        <div style={styles.badge}>{users.length} Users</div>
      </div>

      {/* Alert Messages */}
      {successMsg && (
        <div style={styles.success}>✅ {successMsg}</div>
      )}
      {error && (
        <div style={styles.errorBox}>⚠️ {error}</div>
      )}

      {/* Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Profile</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Joined</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>{idx + 1}</td>
                <td style={styles.td}>
                  <div style={styles.userCell}>
                    {user.pictureUrl ? (
                      <img src={user.pictureUrl} alt="" style={styles.avatar} />
                    ) : (
                      <div style={styles.avatarFallback}>
                        {user.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <span style={styles.userName}>{user.name || 'Unknown'}</span>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={styles.email}>{user.email}</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.date}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </td>
                <td style={styles.td}>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    style={styles.select}
                  >
                    <option value="USER">👤 USER</option>
                    <option value="ADMIN">🛡️ ADMIN</option>
                  </select>
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleSaveRole(user.id, user.role)}
                    disabled={saving === user.id}
                    style={{
                      ...styles.saveBtn,
                      opacity: saving === user.id ? 0.6 : 1,
                    }}
                  >
                    {saving === user.id ? 'Saving...' : 'Save'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' },
  container: { maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title: { color: '#f1f5f9', fontSize: '1.75rem', fontWeight: '700', margin: '0 0 0.25rem 0' },
  subtitle: { color: '#64748b', fontSize: '0.9rem', margin: 0 },
  badge: {
    backgroundColor: 'rgba(59,130,246,0.15)',
    color: '#60a5fa',
    border: '1px solid #3b82f6',
    borderRadius: '99px',
    padding: '0.35rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  success: {
    backgroundColor: 'rgba(34,197,94,0.1)',
    border: '1px solid #22c55e',
    color: '#4ade80',
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    border: '1px solid #ef4444',
    color: '#fc8181',
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  tableWrapper: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '1rem',
    overflow: 'hidden',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: 'rgba(255,255,255,0.05)' },
  th: {
    padding: '1rem',
    textAlign: 'left',
    color: '#64748b',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.05)' },
  td: { padding: '1rem', color: '#e2e8f0', fontSize: '0.9rem' },
  userCell: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' },
  avatarFallback: {
    width: '36px', height: '36px', borderRadius: '50%',
    backgroundColor: '#4285f4', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '0.9rem', flexShrink: 0,
  },
  userName: { fontWeight: '500' },
  email: { color: '#94a3b8', fontSize: '0.875rem' },
  date: { color: '#64748b', fontSize: '0.875rem' },
  select: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '0.375rem',
    color: '#e2e8f0',
    padding: '0.35rem 0.5rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
  saveBtn: {
    padding: '0.4rem 1rem',
    backgroundColor: 'rgba(59,130,246,0.2)',
    color: '#60a5fa',
    border: '1px solid #3b82f6',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
  },
};
