import React, { useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import { ShieldAlert, Check, X } from 'lucide-react';

export default function AdminApprovalPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Rejection Box State
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getAllBookings();
      // Show only pending bookings for admin action
      setBookings(data.filter(b => b.status === 'PENDING'));
    } catch (err) {
      setError('Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await bookingService.updateBookingStatus(id, { status: 'APPROVED' });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve booking.');
    }
  };

  const triggerReject = (id) => {
    setRejectingId(id);
    setRejectReason('');
    setValidationError('');
  };

  const cancelReject = () => {
    setRejectingId(null);
    setRejectReason('');
    setValidationError('');
  };

  const submitReject = async () => {
    if (!rejectReason || rejectReason.trim().length < 5) {
      setValidationError("Reason must be at least 5 characters to reject.");
      return;
    }

    try {
      await bookingService.updateBookingStatus(rejectingId, { 
        status: 'REJECTED',
        rejectionReason: rejectReason.trim()
      });
      setRejectingId(null);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject booking.');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#111827' }}>
          <ShieldAlert size={24} color="var(--primary-color)" />
          Admin Approval Dashboard
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <p>Loading pending bookings...</p>
        ) : bookings.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>There are no pending booking requests right now.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Req ID</th>
                  <th>User ID</th>
                  <th>Resource</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id}>
                    <td>#{booking.id}</td>
                    <td>{booking.userId}</td>
                    <td>{booking.resourceId}</td>
                    <td>{new Date(booking.startTime).toLocaleString()}</td>
                    <td>{new Date(booking.endTime).toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-success" 
                          style={{ padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          onClick={() => handleApprove(booking.id)}
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{ padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          onClick={() => triggerReject(booking.id)}
                        >
                          <X size={14} /> Reject
                        </button>
                      </div>

                      {/* Explicit Rejection Box (Inline Modal) */}
                      {rejectingId === booking.id && (
                        <div style={modalStyle}>
                          <h4 style={{ margin: '0 0 0.5rem 0', color: '#111827' }}>Reject Request</h4>
                          <input 
                            type="text" 
                            style={inputStyle}
                            placeholder="Enter valid reason..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            autoFocus
                          />
                          {validationError && <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0.5rem 0' }}>{validationError}</p>}
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button onClick={submitReject} className="btn btn-danger" style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}>Confirm</button>
                            <button onClick={cancelReject} className="btn btn-outline" style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem', background: '#f3f4f6', color: '#374151', border: 'none' }}>Cancel</button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const modalStyle = {
  marginTop: '0.75rem',
  padding: '1rem',
  backgroundColor: '#fef2f2',
  border: '1px solid #fca5a5',
  borderRadius: '0.5rem',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  width: '280px',
  position: 'absolute',
  zIndex: 10
};

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  border: '1px solid #fecaca',
  borderRadius: '0.25rem',
  outline: 'none',
  fontSize: '0.85rem'
};
