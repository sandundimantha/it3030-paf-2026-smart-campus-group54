import api from './api';

export const maintenanceService = {
  // Report a new issue (Function 1)
  reportIssue: async (data, imageFiles) => {
    const formData = new FormData();
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("location", data.location);
    formData.append("priority", data.priority);
    
    if (imageFiles && imageFiles.length > 0) {
      const maxFiles = Math.min(imageFiles.length, 3);
      for (let i = 0; i < maxFiles; i++) {
        formData.append("images", imageFiles[i]);
      }
    }

    const response = await api.post('/maintenance/report', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // View tickets (Function 3 - handles role-based logic automatically in BE)
  getAllTickets: async () => {
    const response = await api.get('/maintenance/tickets');
    return response.data;
  },

  // Update status (Function 2)
  updateStatus: async (id, status) => {
    const response = await api.patch(`/maintenance/tickets/${id}/status?status=${status}`);
    return response.data;
  },

  // Assign Technician (Function 2 enhancement)
  assignTechnician: async (id, technicianId) => {
    const response = await api.patch(`/maintenance/tickets/${id}/assign?technicianId=${technicianId}`);
    return response.data;
  },

  // Submit Feedback (Function 4)
  submitFeedback: async (id, comment, rating) => {
    const response = await api.patch(`/maintenance/tickets/${id}/feedback`, null, {
      params: { comment, rating }
    });
    return response.data;
  }
};
