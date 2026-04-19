import api from './api';

const userService = {

  // Function 4: Get my own profile
  getMyProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Function 4: Admin - get all users
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Function 4: Admin - update a user's role
  updateUserRole: async (userId, role) => {
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data;
  },
};

export default userService;
