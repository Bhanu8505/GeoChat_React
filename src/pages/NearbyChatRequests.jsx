import { useNavigate } from "react-router-dom";
import chatService from "../services/chatService";
import useNotification from "../context/useNotification";

const NearbyChatRequests = () => {
  const navigate = useNavigate();

  const { pendingChatRequests, setPendingChatRequests } = useNotification();

  const handleAccept = async (request) => {
    try {
      const response = await chatService.nearbyChatRequestAccept(request.id);

      setPendingChatRequests((prev) =>
        prev.filter((item) => item.id !== request.id),
      );

      navigate(`/chat/${response.data.conversationId}`);
    } catch (error) {
      console.error(
        "Failed to accept chat request:",
        error.response?.data?.apiError?.message,
      );
    }
  };

  const handleReject = async (request) => {
    try {
      await chatService.nearbyChatRequestReject(request.id);

      setPendingChatRequests((prev) =>
        prev.filter((item) => item.id !== request.id),
      );
    } catch (error) {
      console.error(
        "Failed to reject chat request:",
        error.response?.data?.apiError?.message,
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Pending Chat Requests</h1>

      {pendingChatRequests.length === 0 ? (
        <p className="text-gray-500">No pending chat requests.</p>
      ) : (
        <div className="space-y-4">
          {pendingChatRequests.map((request) => (
            <div
              key={request.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">Nearby Chat Request</p>

                <p className="text-sm text-gray-500">
                  Sender ID: {request.senderId}
                </p>
                <p className="text-sm text-gray-500">
                  Receiver ID: {request.receiverId}
                </p>

                <p className="text-sm text-gray-500">
                  Status: {request.status}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(request)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Accept
                </button>

                <button
                  onClick={() => handleReject(request)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyChatRequests;
