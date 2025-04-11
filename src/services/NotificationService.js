// frontend/group-saving/src/services/NotificationService.js
import api from './api';

export const getNotifications = async (unreadOnly = false, limit = 20) => {
  try {
    const response = await api.get(`/api/notifications?unread=${unreadOnly}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.post(`/api/notifications/mark-read/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.post('/api/notifications/mark-all-read');
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};