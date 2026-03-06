import React from "react";
import useNotifications from "../../hooks/useNotifications";
import useClickOutside from "../../hooks/useClickOutside";
import { AnimatePresence } from "motion/react";
import NotificationDropdown from "./NotificationDropdown";
import { Bell } from "lucide-react";
import './Header.css';


const Header = () => {
    const [showNotifications, setShowNotifications] = React.useState(false);
    const { notifications = [], markAsRead, markAllAsRead } = useNotifications();
    const unreadCount = notifications.filter((n) => !n.read).length;
    const notificationRef = React.useRef<HTMLDivElement>(null!);

    useClickOutside(notificationRef, () => setShowNotifications(false));

    const handleToggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <>
            <header className="dashboard-header">
            
            <h1 className="dashboard-title">
                {/* <div className="logo-header-icon">
                    <img src="/src/assets/finance-logo.svg" alt="Finance logo" className="logo-image" />
                </div> */}
                <div className="dashboard-t1">
                    Dashboard
                </div>
                </h1>
            <div className="header-action">
                <div className="notification-wrapper" ref={notificationRef}>
                    <button onClick={handleToggleNotifications} className="btn-icon">
                        <Bell size={24} className="notification-icon" />
                        {unreadCount > 0 && (
                            <span className="notification-badge">{unreadCount}</span>
                        )}
                    </button>                    
                    <AnimatePresence>
                        {showNotifications && (
                            <NotificationDropdown
                                notifications={notifications}
                                unreadcount={unreadCount}
                                markAsRead={markAsRead}
                                markAllAsRead={markAllAsRead}
                            />
                        )}
                    </AnimatePresence>
                    <div className="header-profile">
                        <img src="src/assets/Profilepic.png" alt="Profile" className="header-profile-img" referrerPolicy="no-referrer" />
                    </div>
                </div>
            </div>
        </header>

        </>
    );
};

export default Header;