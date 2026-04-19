import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { maintenanceService } from '../services/maintenanceService';
import { AlertTriangle, MapPin, UploadCloud, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function ReportIncidentPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: 'Electrical',
    description: '',
    location: '',
    priority: 'MEDIUM'
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = ['Electrical', 'Plumbing', 'IT Support', 'Furniture', 'Security', 'Cleaning', 'Other'];
  const priorities = [
    { value: 'LOW', label: 'Low', color: '#10b981' },
    { value: 'MEDIUM', label: 'Medium', color: '#f59e0b' },
    { value: 'HIGH', label: 'High', color: '#ef4444' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + imageFiles.length > 3) {
      setError("Maximum 3 images allowed.");
      return;
    }
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    setImageFiles(prev => [...prev, ...files]);
    setError(null);
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...previews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setImageFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await maintenanceService.reportIssue(formData, imageFiles);
      setSuccess(true);
      setTimeout(() => navigate('/maintenance-hub'), 2000); 
    } catch (err) {
      console.error("Report error:", err);
      setError(err.response?.data?.message || 'Failed to report incident. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '700px', marginTop: '3rem', paddingBottom: '4rem' }}>
      <div className="card" style={{ borderTop: '5px solid #ef4444', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1e293b', fontSize: '1.75rem' }}>
          <AlertTriangle size={32} color="#ef4444" />
          Report Campus Incident
        </h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          Help us maintain a safe campus by reporting issues. Our team will look into it promptly.
        </p>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
            <CheckCircle size={18} /> Incident reported! Redirecting to hub...
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {priorities.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p.value })}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: '2px solid',
                      borderColor: formData.priority === p.value ? p.color : '#e2e8f0',
                      backgroundColor: formData.priority === p.value ? `${p.color}22` : 'transparent',
                      color: formData.priority === p.value ? p.color : '#64748b',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Location <MapPin size={14} style={{ display: 'inline', opacity: 0.7 }} /></label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Computing Faculty Room 302"
              className="input-field"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Detailed Description</label>
            <textarea
              name="description"
              rows={4}
              placeholder="What seems to be the problem?"
              className="input-field"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Evidence Photos (Max 3)</label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '0.75rem',
              marginTop: '0.5rem' 
            }}>
              {previews.map((src, idx) => (
                <div key={idx} style={{ position: 'relative', aspectRatio: '1/1' }}>
                  <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem' }} alt="" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(idx)}
                    style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              
              {imageFiles.length < 3 && (
                <label style={{ 
                  aspectRatio: '1/1', 
                  border: '2px dashed #cbd5e1', 
                  borderRadius: '0.5rem', 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer',
                  color: '#64748b',
                  fontSize: '0.75rem',
                  gap: '0.25rem'
                }}>
                  <UploadCloud size={20} />
                  Add Photo
                  <input type="file" accept="image/*" multiple onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
              )}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '3.5rem', fontSize: '1.1rem', backgroundColor: '#ef4444', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Submitting Report...' : 'Launch Incident Response'}
          </button>
        </form>
      </div>
    </div>
  );
}
