import { createContext, useCallback, useMemo, useState } from "react";

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const pushNotification = useCallback(({ title, message, type = "info" }) => {
    const notification = {
      id: crypto.randomUUID(),
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => [notification, ...prev].slice(0, 25));
    return notification;
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  }, []);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  const value = {
    notifications,
    unreadCount,
    pushNotification,
    markAsRead,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
