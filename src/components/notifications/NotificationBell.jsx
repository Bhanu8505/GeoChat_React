import { Link } from "react-router-dom";
import useNotification from "../../context/useNotification";

const NotificationBell = () => {
  const { unreadCount, setUnreadCount } = useNotification();

  return (
    <Link to="/notifications" className="relative">
      🔔
      {unreadCount > 0 && (
        <span
          className="
                    absolute
                    -top-3
                    -right-3
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
