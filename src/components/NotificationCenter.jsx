import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, BookOpen, Share2, Calendar } from 'lucide-react';
import { useNotifications } from '../hooks/useAPI';
import '../styles/NotificationCenter.css';

const NotificationCenter = () => {
  const { notifications, unreadCount, fetchNotifications, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [userId] = useState('user-001'); // In production, get from auth

  // Fetch notifications on mount
  useEffect(() => {
    if (userId) {
      fetchNotifications(userId);
      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => fetchNotifications(userId), 30000);
      return () => clearInterval(interval);
    }
  }, [userId, fetchNotifications]);

  const handleNotificationClick = (notificationId) => {
    markAsRead(notificationId);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'exam':
        return <Calendar size={20} />;
      case 'document':
        return <BookOpen size={20} />;
      case 'share':
        return <Share2 size={20} />;
      case 'announcement':
        return <AlertCircle size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'exam':
        return '--color-exam';
      case 'document':
        return '--color-document';
      case 'share':
        return '--color-share';
      case 'announcement':
        return '--color-announcement';
      default:
        return '--color-default';
    }
  };

  return (
    <div className="notification-center">
      {/* Bell Icon Button */}
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Notifications</h3>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="notification-empty">
              <Bell size={40} style={{ opacity: 0.3 }} />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div
                    className="notification-icon"
                    style={{ color: `var(${getNotificationColor(notification.type)})` }}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">
                      {new Date(notification.timestamp).toLocaleDateString()} •{' '}
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </div>
                  </div>

                  {!notification.read && (
                    <div className="notification-unread-indicator" />
                  )}

                  {notification.actionUrl && (
                    <a href={notification.actionUrl} className="notification-action">
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="notification-footer">
            <small>Check back regularly for updates</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
