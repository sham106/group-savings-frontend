// frontend/group-saving/src/components/common/Notifications.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../services/NotificationService';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load notifications when component mounts
    fetchNotifications();
    
    // Set up interval to refresh notifications every minute
    const intervalId = setInterval(fetchNotifications, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await getNotifications(false, 10);
      setNotifications(data.notifications);
      setUnreadCount(data.unread_count);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if not already read
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
        
        // Update local state
        const updatedNotifications = notifications.map(n => 
          n.id === notification.id ? { ...n, read: true } : n
        );
        setNotifications(updatedNotifications);
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
    
    // Navigate based on notification type
    if (notification.type === 'contribution') {
      navigate(`/dashboard/group/${notification.group_id}`);
    } else if (notification.type === 'withdrawal_request') {
      navigate(`/dashboard/group/${notification.group_id}`);
    } else if (notification.type === 'withdrawal_approved') {
      navigate(`/dashboard/group/${notification.group_id}`);
    } else if (notification.type === 'withdrawal_rejected') {
      navigate(`/dashboard/group/${notification.group_id}`);
    } else {
      navigate('/dashboard');
    }
    
    // Close notifications panel
    setIsOpen(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'contribution':
        return '💰';
      case 'withdrawal_request':
        return '🔔';
      case 'withdrawal_approved':
        return '✅';
      default:
        return '📌';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <button 
        className="p-2 rounded-full hover:bg-gray-200 focus:outline-none relative"
        onClick={toggleNotifications}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Notifications Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
          <div className="p-3 bg-gray-100 border-b flex justify-between items-center">
            <h3 className="font-medium text-amber-600">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className={`max-h-96 overflow-y-auto ${isOpen ? 'text-gray-800' : 'text-gray-500'}`}>
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1 text-xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-2 text-center border-t bg-gray-50">
            <button 
              onClick={() => navigate('/dashboard/notifications')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;