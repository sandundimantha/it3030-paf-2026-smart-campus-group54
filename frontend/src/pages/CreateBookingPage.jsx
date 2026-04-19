import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import api from '../services/api';
import { CalendarClock, AlertCircle, CheckCircle, Package } from 'lucide-react';

export default function CreateBookingPage() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get currently logged in user

  const [formData, setFormData] = useState({
    resourceId: '',
    startTime: '',
    endTime: ''
  });
  
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingResources, setFetchingResources] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.get('/resources');
        // Filter only ACTIVE resources for booking
        const activeResources = response.data.filter(r => r.status === 'ACTIVE' || r.status === 'active');
        setResources(activeResources);
      } catch (err) {
        console.error('Failed to fetch resources:', err);
        setError('Could not load facilities list. Please refresh the page.');
      } finally {
        setFetchingResources(false);
      }
    };
    fetchResources();
  }, []);

  // Helper to get today's date in 'YYYY-MM-DDTHH:mm' format for 'min' attribute
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // 1. Client-side Validation: Time Logic
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    const now = new Date();

    if (start >= end) {
      setError('End time must be strictly after start time.');
      setLoading(false);
      return;
    }

    if (start < now) {
      setError('Start time cannot be in the past.');
      setLoading(false);
      return;
    }

    try {
      // Send as local datetime string (without 'Z') for backend LocalDateTime
      const formatLocal = (val) => val.includes(':') && val.length === 16 ? val + ':00' : val;

      await bookingService.createBooking({
        resourceId: Number(formData.resourceId),
        userId: user?.email || 'anonymous',
        startTime: formatLocal(formData.startTime),
        endTime: formatLocal(formData.endTime)
      });
      setSuccess(true);
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        // Explicitly handle 409 Conflict Status Code
        setError(err.response.data.message || 'Resource is already booked during this time slot.');
      } else if (err.response && err.response.status === 404) {
        setError('Resource not found.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '600px', marginTop: '3rem' }}>
      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
          <CalendarClock size={24} />
          Create New Booking
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Reserve campus resources safely. Conflicts will be automatically detected.
        </p>

        {error && (
          <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} />
            Booking created successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="resourceId">Select Facility / Resource</label>
            <div style={{ position: 'relative' }}>
              <select
                id="resourceId"
                name="resourceId"
                className="input-field"
                value={formData.resourceId}
                onChange={handleChange}
                required
                disabled={fetchingResources}
                style={{ appearance: 'none', paddingRight: '2.5rem' }}
              >
                <option value="">{fetchingResources ? 'Loading facilities...' : '-- Choose a Resource --'}</option>
                {resources.map(res => (
                  <option key={res.id} value={res.id}>
                    {res.name} (Capacity: {res.capacity}) - {res.location}
                  </option>
                ))}
              </select>
              <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
                <Package size={18} />
              </div>
            </div>
            {resources.length === 0 && !fetchingResources && (
              <p style={{ color: 'var(--danger-color)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                No active resources found in the system.
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
            <input
              type="datetime-local"
              id="startTime"
              name="startTime"
              className="input-field"
              value={formData.startTime}
              onChange={handleChange}
              min={getMinDateTime()}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endTime">End Time</label>
            <input
              type="datetime-local"
              id="endTime"
              name="endTime"
              className="input-field"
              value={formData.endTime}
              onChange={handleChange}
              min={formData.startTime || getMinDateTime()}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Processing...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
