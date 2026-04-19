import api from './api';

const notificationService = {
  getUserNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  },

  markAsRead: async (id) => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    await api.patch('/notifications/read-all');
  },

  deleteNotification: async (id) => {
    await api.delete(`/notifications/${id}`);
  },
};

export { notificationService };
export default notificationService;
