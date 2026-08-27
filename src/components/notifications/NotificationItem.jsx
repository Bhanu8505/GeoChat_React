import { useNavigate } from "react-router-dom";

const NotificationItem = ({ notification, onRead, onDelete }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!notification.read) {
      await onRead(notification.id);
    }
  };

  if (notification.type === "MESSAGE") {
    navigate(`/chat/${notification.conversationId}`);
  }

  return (
    <div
      onClick={handleClick}
      className={`p-4 border-b cursor-pointer ${
        notification.read ? "bg-white" : "bg-blue-50"
      }`}
    >
      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold">{notification.title}</h3>

          <p className="text-gray-600">{notification.message}</p>
        </div>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onDelete(notification.id);
          }}
          className="text-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
