import api from './api';

export const bookingService = {
  // Function 1: Create Booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Function 2: Get User Bookings
  getUserBookings: async () => {
    const response = await api.get('/bookings/user');
    return response.data;
  },

  // Function 3: Cancel Booking
  cancelBooking: async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  // Function 4: Admin Get All Bookings
  getAllBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  // Function 4: Admin Approve/Reject
  updateBookingStatus: async (id, statusData) => {
    const response = await api.put(`/bookings/${id}/status`, statusData);
    return response.data;
  }
};
