import React, { useState, useEffect } from 'react';
import { maintenanceService } from '../services/maintenanceService';
import { useAuth } from '../context/AuthContext';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  User, 
  MapPin, 
  MessageSquare, 
  Star
} from 'lucide-react';

export default function MaintenanceDashboard() {
  const { user, isAdmin } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [error, setError] = useState(null);

  // Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(null);
  const [feedback, setFeedback] = useState({ comment: '', rating: 5 });

  // Assign Modal State
  const [showAssignModal, setShowAssignModal] = useState(null);
  const [technicianId, setTechnicianId] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await maintenanceService.getAllTickets();
      setTickets(data);
    } catch (err) {
      setError("Failed to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await maintenanceService.updateStatus(id, status);
      fetchTickets();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await maintenanceService.assignTechnician(showAssignModal, technicianId);
      setShowAssignModal(null);
      setTechnicianId('');
      fetchTickets();
    } catch (err) {
      alert("Error assigning technician");
    }
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    try {
      await maintenanceService.submitFeedback(showFeedbackModal, feedback.comment, feedback.rating);
      setShowFeedbackModal(null);
      setFeedback({ comment: '', rating: 5 });
      fetchTickets();
    } catch (err) {
      alert("Error submitting feedback");
    }
  };

  const filteredTickets = filter === 'ALL' 
    ? tickets 
    : tickets.filter(t => t.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#ef4444';
      case 'IN_PROGRESS': return '#f59e0b';
      case 'RESOLVED': return '#10b981';
      default: return '#64748b';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return '#ef4444';
      case 'MEDIUM': return '#f59e0b';
      case 'LOW': return '#10b981';
      default: return '#64748b';
    }
  };

  if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Loading Maintenance Hub...</div>;

  return (
    <div className="container animate-fade-in" style={{ marginTop: '2rem', paddingBottom: '5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle color="#ef4444" size={36} />
            Maintenance Hub
          </h1>
          <p style={{ color: '#64748b' }}>
            {isAdmin ? "Manage campus-wide incident reports and technician assignments." : "Track your reported issues and provide feedback on fixes."}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '0.75rem' }}>
          {['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: filter === f ? 'white' : 'transparent',
                color: filter === f ? '#1e293b' : '#64748b',
                fontWeight: filter === f ? '600' : '400',
                boxShadow: filter === f ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer'
              }}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </header>

      {filteredTickets.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
          <h3>No tickets found</h3>
          <p style={{ color: '#64748b' }}>Everything seems to be working perfectly on campus.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {filteredTickets.map(ticket => (
            <div key={ticket.id} className="card hvr-float" style={{ position: 'relative', overflow: 'hidden' }}>
              {/* Status Indicator */}
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                padding: '0.25rem 1rem', 
                backgroundColor: getStatusColor(ticket.status),
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: '800',
                borderBottomLeftRadius: '0.5rem'
              }}>
                {ticket.status}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: '700', 
                    color: getPriorityColor(ticket.priority),
                    backgroundColor: `${getPriorityColor(ticket.priority)}11`,
                    padding: '0.1rem 0.5rem',
                    borderRadius: '1rem',
                    border: `1px solid ${getPriorityColor(ticket.priority)}33`
                  }}>
                    {ticket.priority} PRIORITY
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>•</span>
                  <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>{ticket.category}</span>
                </div>
                <h3 style={{ fontSize: '1.125rem', color: '#1e293b', marginBottom: '0.5rem' }}>{ticket.location}</h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5' }}>{ticket.description}</p>
              </div>

              {/* Images if any */}
              {ticket.images && ticket.images.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  {ticket.images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img.imageUrl} 
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '0.4rem', border: '1px solid #e2e8f0' }} 
                      alt="" 
                    />
                  ))}
                </div>
              )}

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                  <Clock size={14} />
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {isAdmin && ticket.status === 'PENDING' && (
                    <button 
                      onClick={() => setShowAssignModal(ticket.id)}
                      className="btn btn-primary" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: '#6366f1' }}
                    >
                      Assign
                    </button>
                  )}
                  
                  {isAdmin && ticket.status === 'IN_PROGRESS' && (
                    <button 
                      onClick={() => handleStatusUpdate(ticket.id, 'RESOLVED')}
                      className="btn btn-primary" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: '#10b981' }}
                    >
                      Resolve
                    </button>
                  )}

                  {!isAdmin && ticket.status === 'RESOLVED' && !ticket.feedbackAt && (
                    <button 
                      onClick={() => setShowFeedbackModal(ticket.id)}
                      className="btn btn-primary" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: '#f59e0b' }}
                    >
                      Give Feedback
                    </button>
                  )}
                </div>
              </div>

              {/* Assignment Info */}
              {ticket.technicianId && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '0.4rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={12} />
                  Technician: <span style={{ fontWeight: '600' }}>{ticket.technicianId}</span>
                </div>
              )}

              {/* Resolved / Feedback Info */}
              {ticket.feedbackAt && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '0.4rem', border: '1px solid #dcfce7' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#166534' }}>USER FEEDBACK</span>
                    <div style={{ display: 'flex', color: '#f59e0b' }}>
                      {[...Array(ticket.feedbackRating)].map((_, i) => <Star key={i} size={10} fill="#f59e0b" />)}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#166534', fontStyle: 'italic' }}>"{ticket.feedbackComment}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '400px' }}>
            <h3>Assign Technician</h3>
            <form onSubmit={handleAssign}>
              <div className="form-group">
                <label>Technician ID / Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={technicianId} 
                  onChange={(e) => setTechnicianId(e.target.value)} 
                  required 
                  placeholder="Enter staff ID"
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Confirm</button>
                <button type="button" onClick={() => setShowAssignModal(null)} className="btn" style={{ flex: 1, border: '1px solid #e2e8f0' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '450px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star color="#f59e0b" fill="#f59e0b" />
              Service Feedback
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Your feedback helps us improve campus facilities.</p>
            <form onSubmit={handleFeedback}>
              <div className="form-group">
                <label>How satisfied are you?</label>
                <div style={{ display: 'flex', gap: '0.75rem', margin: '0.5rem 0' }}>
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFeedback({...feedback, rating: num})}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        border: '2px solid',
                        borderColor: feedback.rating === num ? '#f59e0b' : '#e2e8f0',
                        backgroundColor: feedback.rating === num ? '#fef3c7' : 'white',
                        color: feedback.rating === num ? '#b45309' : '#64748b',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Comments</label>
                <textarea 
                  className="input-field" 
                  rows={3}
                  value={feedback.comment} 
                  onChange={(e) => setFeedback({...feedback, comment: e.target.value})} 
                  required 
                  placeholder="Share your experience..."
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, backgroundColor: '#f59e0b' }}>Submit Review</button>
                <button type="button" onClick={() => setShowFeedbackModal(null)} className="btn" style={{ flex: 1, border: '1px solid #e2e8f0' }}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
