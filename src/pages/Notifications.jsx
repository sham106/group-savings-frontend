// frontend/group-saving/src/pages/Notifications.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow, parseISO } from 'date-fns';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Notifications = () => {
  const { notifications, loading, fetchNotifications, markAsRead, markAllAsRead } = useNotifications();
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification) => {
    // Mark as read if not already read
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    if (notification.type === 'contribution') {
      navigate(`/dashboard/group/${notification.group_id}`);
    } else if (notification.type === 'withdrawal_request') {
      navigate(`/dashboard/group/${notification.group_id}/withdrawals`);
    } else if (notification.type === 'withdrawal_approved') {
      navigate(`/dashboard/group/${notification.group_id}`);
    } else {
      navigate('/dashboard');
    }
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);

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
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={markAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="mb-4 border-b">
        <div className="flex space-x-4">
          <button 
            className={`pb-2 px-1 ${activeTab === 'all' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button 
            className={`pb-2 px-1 ${activeTab === 'unread' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('unread')}
          >
            Unread
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <LoadingSpinner />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {activeTab === 'all' ? 'No notifications to display' : 'No unread notifications'}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredNotifications.map((notification) => (
            <div 
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-start">
                <div className="mr-4 text-2xl">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className={`${!notification.read ? 'font-medium' : ''}`}>
                      {notification.message}
                    </p>
                    <span className="text-sm text-gray-500 ml-4">
                      {formatDistanceToNow(parseISO(notification.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Group: {notification.group_name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;