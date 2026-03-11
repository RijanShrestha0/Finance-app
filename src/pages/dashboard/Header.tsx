import React from "react";
import useNotifications from "../../hooks/useNotifications";
import useClickOutside from "../../hooks/useClickOutside";
import { AnimatePresence } from "motion/react";
import NotificationDropdown from "./NotificationDropdown";
import { Bell } from "lucide-react";
import './Header.css';
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    activePage: string;
}

const Header = ({ activePage }: HeaderProps) => {
    const [showNotifications, setShowNotifications] = React.useState(false);
    const { notifications = [], markAsRead, markAllAsRead } = useNotifications();
    const { user } = useAuth();
    const navigate = useNavigate();
    const unreadCount = notifications.filter((n) => !n.read).length;
    const notificationRef = React.useRef<HTMLDivElement>(null!);
    const avatarSeed = user?.email || user?.name || 'guest-user';

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
                    {activePage}
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
                    <button className="header-profile" onClick={() => navigate('/profile')} title="Open profile">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                            alt="Profile"
                            className="header-profile-img"
                            referrerPolicy="no-referrer"
                        />
                    </button>
                </div>
            </div>
        </header>

        </>
    );
};

export default Header;