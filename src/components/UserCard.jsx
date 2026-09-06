import { useNavigate } from "react-router-dom";
import chatService from "../services/chatService";
import { useState } from "react";

const UserCard = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const chatRequest = async () => {
    try {
      setLoading(true);

      const res = await chatService.nearbyChatRequest({
        receiverId: user.userId,
      });
      console.log("Chat Request response: ", res.data);
    } catch (error) {
      console.log(
        "Error sending chat request: ",
        error?.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {/* Profile */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-600">
          {user.username?.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-gray-800">
            {user.username}
          </h3>

          <p className="text-sm text-green-600">● Nearby</p>
        </div>
      </div>

      {/* Location */}
      <div className="mt-5 rounded-lg bg-gray-50 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Location
        </p>

        <div className="mt-2 space-y-1 text-sm text-gray-600">
          <p>
            <span className="font-medium text-gray-700">Lat:</span>{" "}
            {user.latitude}
          </p>

          <p>
            <span className="font-medium text-gray-700">Long:</span>{" "}
            {user.longitude}
          </p>
        </div>
      </div>

      {/* Chat button */}
      <button
        onClick={chatRequest}
        disabled={loading}
        className="mt-5 w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {loading ? "Opening Chat..." : "Chat"}
      </button>
    </div>
  );
};

export default UserCard;
