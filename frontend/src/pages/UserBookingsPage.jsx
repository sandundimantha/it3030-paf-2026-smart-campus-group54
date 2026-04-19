import React, { useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import { ListIcon, XCircle, CheckCircle, Clock, Ban } from 'lucide-react';

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getUserBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await bookingService.cancelBooking(id);
      fetchBookings(); // Refresh list after cancellation
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING': return <span className="badge badge-pending">Pending</span>;
      case 'APPROVED': return <span className="badge badge-approved">Approved</span>;
      case 'REJECTED': return <span className="badge badge-rejected">Rejected</span>;
      case 'CANCELLED': return <span className="badge badge-cancelled">Cancelled</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <ListIcon size={24} />
          My Bookings
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <p>Loading your bookings...</p>
        ) : bookings.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>You have no bookings yet.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Resource ID</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id}>
                    <td>#{booking.id}</td>
                    <td>{booking.resourceId}</td>
                    <td>{new Date(booking.startTime).toLocaleString()}</td>
                    <td>{new Date(booking.endTime).toLocaleString()}</td>
                    <td>
                      {getStatusBadge(booking.status)}
                      {booking.rejectionReason && (
                         <div style={{fontSize: '0.75rem', color: 'var(--danger-color)', marginTop: '4px'}}>
                           Reason: {booking.rejectionReason}
                         </div>
                      )}
                    </td>
                    <td>
                      {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                        <button 
                          className="btn btn-danger" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          onClick={() => handleCancel(booking.id)}
                        >
                          Cancel
                        </button>
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
