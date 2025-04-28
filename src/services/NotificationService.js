// frontend/group-saving/src/services/NotificationService.js
import api from './api';

export const getNotifications = async (unreadOnly = false, limit = 20) => {
  try {
    const response = await api.get(`/api/notifications?unread=${unreadOnly}&limit=${limit}`);
    console.log('Fetched notifications:', response.data); // Add logging
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



// New functions for real-time updates
export const getUnreadCount = async () => {
  try {
    const response = await api.get('/api/notifications/unread-count');
    return response.data.count;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
};

export const setupNotificationListener = (callback) => {
  // Polling implementation (fallback)
  const pollInterval = setInterval(async () => {
    try {
      const count = await getUnreadCount();
      callback({ type: 'unread_count', data: count });
    } catch (error) {
      console.error('Polling error:', error);
    }
  }, 30000); // Every 30 seconds

  // WebSocket implementation if available
  if (window.WebSocket) {
    const socket = new WebSocket(process.env.REACT_APP_WS_URL || 'wss://your-api-url/ws');
    
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'notification') {
        callback(message);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected, falling back to polling');
    };

    return () => {
      clearInterval(pollInterval);
      socket.close();
    };
  }

  return () => clearInterval(pollInterval);
};