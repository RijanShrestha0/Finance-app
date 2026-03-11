import React from "react";
import { useAuth } from "../hooks/useAuth";

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
    const { user, isLoading } = useAuth();
    const [ notifications, setNotifications] = React.useState<Notification[]>([]);
    const [ showToast, setShowToast ] = React.useState(false);
    const [ toastMessage, setToastMessage ] = React.useState('');

    React.useEffect(() => {
        if (isLoading) {
            return;
        }

        if (!user) {
            setNotifications([]);
            setShowToast(false);
            setToastMessage('');
            return;
        }

        const saved = localStorage.getItem(`notifications_${user.id}`);
        setNotifications(saved ? JSON.parse(saved) : []);
    }, [user, isLoading]);

    // Save notifications to localStorage whenever they change
    React.useEffect(() => {
        if (!user) {
            return;
        }
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
    }, [notifications, user]);

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
