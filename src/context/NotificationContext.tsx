import React from "react";

export type Notification = {
    id: string;
    message: string;
    time: string;
    read: boolean;
};

interface NotificationContextType {
    notifications: Notification[];
    unreadcount: number;
    addNotification: (message: string) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    showToast: boolean;
    toastMessage: string;
    hideToast: () => void;    
}

export const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [ notifications, setNotifications] = React.useState<Notification[]>(() => {
        const saved = localStorage.getItem('notifications');
        return saved ? JSON.parse(saved) : [];
    });
    const [ showToast, setShowToast ] = React.useState(false);
    const [ toastMessage, setToastMessage ] = React.useState('');

    // Save notifications to localStorage whenever they change
    React.useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    const unreadCount = notifications.filter (n => !n.read).length;

    const addNotification = (message: string) => {
        const newNotification: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
        setToastMessage(message);
        setShowToast(true);
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const hideToast = () => {
        setShowToast(false);
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadcount: unreadCount, addNotification, markAsRead, markAllAsRead, showToast, toastMessage, hideToast }}>
            {children}
        </NotificationContext.Provider>
    );
};
