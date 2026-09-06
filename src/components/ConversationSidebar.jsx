import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import chatService from "../services/chatService";
import useAuth from "../context/useAuth";
import usePresence from "../context/usePresence";

const ConversationSidebar = () => {
  const { authUser } = useAuth();
  const { onlineUsers } = usePresence();

  console.log("Auth User : ", authUser);

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { conversationId } = useParams();

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await chatService.getAllConversations();

        console.log("Conversations:", response.data);

        setConversations(response.data.userConversations);
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setLoading(false);
      }
    };
    // const loadOnlineUsers = async () => {
    //   console.log("Loading online users...");
    //   try {
    //     const response = await presenceService.getOnlineUsers();
    //     console.log("Online presence response : ", response.data);
    //     setOnlineUsers(new Set(response.data));
    //   } catch (error) {
    //     console.error("Failed to load online users:", error);
    //   }
    // };

    // loadOnlineUsers();

    loadConversations();
  }, []);

  if (loading) {
    return (
      <aside className="w-80 border-r">
        <div className="p-4">Loading conversations...</div>
      </aside>
    );
  }

  return (
    <aside className="w-80 border-r h-full overflow-y-auto">
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <div className="h-9 w-9 rounded-full bg-gray-300"></div>

        <div>
          <div className="font-medium">
            {authUser?.username || authUser.fullName}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-green-500">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Online
          </div>
        </div>
      </div>
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Conversations</h2>
      </div>

      {conversations.length === 0 ? (
        <div className="p-4 text-gray-500">No conversations yet</div>
      ) : (
        conversations.map((conversation) => {
          const otherParticipants = conversation.participants.find(
            (participant) => participant.userId != authUser.userId,
          );
          const isOnline = onlineUsers.has(otherParticipants?.userId);

          return (
            <div
              key={conversation.conversationId}
              onClick={() => navigate(`/chat/${conversation.conversationId}`)}
              className={`p-4 border-b cursor-pointer ${
                conversation.conversationId === conversationId
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="font-medium">{conversation.conversationName}</div>

              <div className="text-sm text-gray-500 truncate">
                User Id: {otherParticipants?.userId}
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                />

                {isOnline ? "Online" : "Offline"}
              </div>
            </div>
          );
        })
      )}
    </aside>
  );
};

export default ConversationSidebar;
