import api from './api';

export const incidentService = {
  // Create an incident ticket with multiple file uploads
  createIncident: async (incidentData, imageFiles) => {
    const formData = new FormData();
    formData.append("title", incidentData.title);
    formData.append("description", incidentData.description);
    formData.append("location", incidentData.location);
    
    // Append up to 3 files
    if (imageFiles && imageFiles.length > 0) {
      const maxFiles = Math.min(imageFiles.length, 3);
      for (let i = 0; i < maxFiles; i++) {
        formData.append("images", imageFiles[i]);
      }
    }

    const response = await api.post('/incidents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getUserIncidents: async () => {
    const response = await api.get('/incidents/user');
    return response.data;
  },

  getAllIncidents: async () => {
    const response = await api.get('/incidents');
    return response.data;
  }
};
