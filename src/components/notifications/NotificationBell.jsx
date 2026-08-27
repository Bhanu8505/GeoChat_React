import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import notificationService from "../../services/notificationService";

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadNotificationsCount();

      setUnreadCount(response.data);
    } catch (error) {
      console.error("Failed to get unread count:", error);
    }
  };

  useEffect(() => {
    loadUnreadCount();
  }, []);

  return (
    <Link to="/notifications" className="relative">
      🔔
      {unreadCount > 0 && (
        <span
          className="
                    absolute
                    -top-2
                    -right-2
                    bg-red-500
                    text-white
                    text-xs
                    rounded-full
                    px-2
                    py-1
                "
        >
          {unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
