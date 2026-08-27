import { useEffect, useState } from "react";
import notificationService from "../services/notificationService";
import NotificationItem from "../components/notifications/NotificationItem";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const response = await notificationService.getAllNotifications();

      console.log("Notifications from backend:", response.data);

      setNotifications(response.data.allNotificationsResponseList);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleRead = async (notificationId) => {
    try {
      await notificationService.readNotificationById(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification,
        ),
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true,
        })),
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationService.deleteNotificationById(notificationId);

      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId),
      );
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>

        {notifications.some((notification) => !notification.read) && (
          <button onClick={handleMarkAllRead} className="text-blue-600">
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={handleRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
