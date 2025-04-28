// frontend/group-saving/src/context/NotificationContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  setupNotificationListener 
} from '../services/NotificationService';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext'; // Optional: if you have socket context

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const socket = useSocket(); // Optional: if using WebSockets

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotifications(false, 20);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);

      // Debugging: Check if M-Pesa notifications are included
      console.log('Fetched notifications:', data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle new notifications from WebSocket or polling
  const handleNewNotification = useCallback((newNotification) => {
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Optional: Show toast notification
    if (newNotification.type === 'CONTRIBUTION') {
      console.log(`New contribution: ${newNotification.message}`);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    // Initial fetch
    fetchNotifications();

    // Set up real-time updates
    let cleanup;
    
    if (socket) {
      // WebSocket implementation
      socket.on('new_notification', handleNewNotification);
      
      cleanup = () => {
        socket.off('new_notification', handleNewNotification);
      };
    } else {
      // Polling fallback
      const intervalId = setInterval(fetchNotifications, 30000);
      cleanup = () => clearInterval(intervalId);
    }

    return cleanup;
  }, [user, fetchNotifications, handleNewNotification, socket]);

  const markAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      return true;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
      return true;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return false;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        handleNewNotification // Expose if needed by other components
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;