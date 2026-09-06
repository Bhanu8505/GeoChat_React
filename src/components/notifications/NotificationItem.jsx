const NotificationItem = ({
  notification,
  onRead,
  onDelete,
  onClick,
  onAccept,
  onReject,
  pendingChatRequests,
}) => {
  const isPendingChatRequest =
    notification.notificationType === "NEW_CHAT_REQUEST" &&
    notification.referenceType === "REQUEST" &&
    pendingChatRequests.some(
      (request) => request.id === notification.referenceId,
    );

  return (
    <div
      onClick={() => onClick(notification)}
      className={`p-4 border-b cursor-pointer ${
        notification.read ? "bg-white" : "bg-gray-300"
      }`}
    >
      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold">{notification.title}</h3>

          <p className="text-gray-600">{notification.message}</p>
          {isPendingChatRequest && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onAccept(notification);
                }}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Accept
              </button>

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onReject(notification);
                }}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          )}
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
