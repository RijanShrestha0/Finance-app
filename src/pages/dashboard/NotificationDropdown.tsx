import { Check, Inbox } from 'lucide-react';
import { motion } from 'motion/react';
import type { Notification } from "../../context/NotificationContext";

export type NotificationDropdownProps = {
    notifications: Notification[];
    unreadcount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
}

const NotificationDropdown = ({
    notifications,
    unreadcount,
    markAsRead,
    markAllAsRead
}: NotificationDropdownProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className='notification-dropdown'
        >
        <div className="notification-dropdown-header">
            <div className="notification-dropdown-title">Notifications</div>
            {unreadcount > 0 && (
                <button className="mark-all-read-btn" onClick={markAllAsRead}>
                    Mark all as read
                </button>
            )}
            </div>

                  <div className="notification-list">
        {notifications.length > 0 ? (
          <div className="notification-items-container">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className="notification-item"
              >
                <div className="notification-item-content">
                  <p className="notification-item-message">
                    {notification.message}
                  </p>
                  {!notification.read && (
                    <div className="notification-unread-dot" />
                  )}
                </div>
                <div className="notification-item-footer">
                  <span className="notification-item-time">{notification.time}</span>
                  {notification.read && (
                    <Check className="notification-check-icon" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="notification-empty">
            <div className="notification-empty-icon-container">
              <Inbox className="notification-empty-icon" />
            </div>
            <p className="notification-empty-title">No notifications</p>
            <p className="notification-empty-text">We'll notify you when something happens.</p>
          </div>
        )}
      </div>
    </motion.div>

    );
};

export default NotificationDropdown;