import api from './api';

export const bookService = {
  getBooks: (params) => api.get('/books', { params }),
  getBook: (id) => api.get(`/books/${id}`),
  createBook: (data) => api.post('/books', data),
  updateBook: (id, data) => api.put(`/books/${id}`, data),
  deleteBook: (id) => api.delete(`/books/${id}`),
  getQRCode: (id) => api.get(`/books/${id}/qrcode`),
};

export const issueService = {
  issueBook: (data) => api.post('/issues', data),
  getAllIssues: (params) => api.get('/issues', { params }),
  getMyIssues: (params) => api.get('/issues/my', { params }),
  getIssue: (id) => api.get(`/issues/${id}`),
  returnBook: (id) => api.put(`/issues/${id}/return`),
  payFine: (id) => api.put(`/issues/${id}/pay-fine`),
};

export const reservationService = {
  reserveBook: (data) => api.post('/reservations', data),
  getMyReservations: () => api.get('/reservations/my'),
  getAllReservations: (params) => api.get('/reservations', { params }),
  cancelReservation: (id) => api.put(`/reservations/${id}/cancel`),
};

export const userService = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const categoryService = {
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export const reportService = {
  getDashboardStats: () => api.get('/reports/dashboard'),
  getBorrowingReport: () => api.get('/reports/borrowings'),
  getFineReport: () => api.get('/reports/fines'),
  getStudentDashboard: () => api.get('/reports/student-dashboard'),
  getActivityLogs: (params) => api.get('/reports/activity-logs', { params }),
};

export const authService = {
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};
