import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { CalendarClock, AlertCircle, CheckCircle } from 'lucide-react';

export default function CreateBookingPage() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get currently logged in user

  const [formData, setFormData] = useState({
    resourceId: '',
    startTime: '',
    endTime: ''
  });
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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
      await bookingService.createBooking({
        resourceId: Number(formData.resourceId),
        userId: user?.email || 'anonymous',
        startTime: start.toISOString(),
        endTime: end.toISOString()
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
            <label htmlFor="resourceId">Resource ID (e.g. 1 for Lecture Hall)</label>
            <input
              type="number"
              id="resourceId"
              name="resourceId"
              className="input-field"
              value={formData.resourceId}
              onChange={handleChange}
              required
              min="1"
            />
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
