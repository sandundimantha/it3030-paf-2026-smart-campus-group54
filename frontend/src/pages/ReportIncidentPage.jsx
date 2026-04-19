import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { incidentService } from '../services/incidentService';
import { AlertTriangle, MapPin, UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

export default function ReportIncidentPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: ''
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate maximum 3 files
    if (files.length > 3) {
      setError("You can only upload a maximum of 3 tracking images.");
      e.target.value = null; // Clear input
      return;
    }
    
    // Validate file sizes (Max 5MB per assignment constraints)
    const validFiles = files.filter(f => f.size <= 5 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      setError("Some files exceed the 5MB size limit and were rejected.");
    } else {
      setError(null);
    }

    setImageFiles(validFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await incidentService.createIncident(formData, imageFiles);
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000); // Route somewhere meaningful
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while linking the incident report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '600px', marginTop: '3rem' }}>
      <div className="card" style={{ borderTop: '4px solid var(--danger-color)' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
          <AlertTriangle size={24} color="var(--danger-color)" />
          Report Campus Incident
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Notice a maintenance issue, security concern, or IT failure? Report it here with up to 3 image contexts.
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
            Incident successfully reported! Our teams will look into it.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Incident Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g. Broken Projector in Hall 3"
              className="input-field"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location <MapPin size={14} style={{ display: 'inline', marginLeft: '2px' }} /></label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Specific building or room number"
              className="input-field"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Detailed Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Provide as much context as possible..."
              className="input-field"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ 
            marginTop: '1.5rem', 
            padding: '1.5rem', 
            border: '2px dashed var(--border-color)', 
            borderRadius: '0.5rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-color)'
          }}>
            <UploadCloud size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem' }} />
            <label htmlFor="images" style={{ cursor: 'pointer', color: 'var(--primary-color)', fontWeight: '600' }}>
              Select visual evidence attachments
            </label>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              PNG, JPG, up to 5MB. Maximum 3 images. <br />
              <b>Selected: {imageFiles.length}</b>
            </p>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', backgroundColor: 'var(--danger-color)' }} disabled={loading}>
            {loading ? 'Submitting Reference...' : 'Submit Incident Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
}
