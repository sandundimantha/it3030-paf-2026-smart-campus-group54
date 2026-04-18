import api from './api';

const notificationService = {

  // Function 2: Get all notifications
  getUserNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  // Function 2: Get unread count (for bell badge)
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  },

  // Function 3: Mark one notification as read
  markAsRead: async (id) => {
    await api.patch(`/notifications/${id}/read`);
  },

  // Function 3: Mark ALL notifications as read
  markAllAsRead: async () => {
    await api.patch('/notifications/read-all');
  },

  // Delete a notification
  deleteNotification: async (id) => {
    await api.delete(`/notifications/${id}`);
  },
};

export default notificationService;
