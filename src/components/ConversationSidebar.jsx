import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import chatService from "../services/chatService";

const ConversationSidebar = () => {
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
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Conversations</h2>
      </div>

      {conversations.length === 0 ? (
        <div className="p-4 text-gray-500">No conversations yet</div>
      ) : (
        conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => navigate(`/chat/${conversation.conversationId}`)}
            className={`p-4 border-b cursor-pointer ${
              conversation.id === conversationId
                ? "bg-gray-200"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="font-medium">{conversation.conversationName}</div>

            <div className="text-sm text-gray-500 truncate">
              {conversation.role}
            </div>
          </div>
        ))
      )}
    </aside>
  );
};

export default ConversationSidebar;
