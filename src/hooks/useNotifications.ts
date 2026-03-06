import React from "react";
import { NotificationContext } from "../context/NotificationContext";

const useNotifications = () => {
    const context = React.useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
};

export default useNotifications;