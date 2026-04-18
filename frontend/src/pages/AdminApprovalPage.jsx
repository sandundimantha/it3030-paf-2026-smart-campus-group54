import React, { useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import { ShieldAlert, Check, X } from 'lucide-react';

export default function AdminApprovalPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleReject = async (id) => {
    const reason = window.prompt("Please provide a rejection reason:");
    if (reason === null) return; // User cancelled prompt

    try {
      await bookingService.updateBookingStatus(id, { 
        status: 'REJECTED',
        rejectionReason: reason || 'Not specified'
      });
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
                          onClick={() => handleReject(booking.id)}
                        >
                          <X size={14} /> Reject
                        </button>
                      </div>
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
