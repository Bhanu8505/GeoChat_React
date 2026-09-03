import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import chatService from "../services/chatService";
import websocketService from "../services/webSocketService";
import useAuth from "../context/useAuth";
import ConversationSidebar from "../components/ConversationSidebar";

const Chat = () => {
  const { conversationId } = useParams();
  const { authUser } = useAuth();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);

  const handleSend = async () => {
    if (!conversationId || !messageText.trim()) {
      return;
    }

    try {
      websocketService.sendMessage(`/app/${conversationId}/messages`, {
        message: messageText,
      });

      setMessageText("");
    } catch (error) {
      console.log(
        "Error sending message:",
        error?.response?.data || error.message,
      );
    }
  };

  // Subscribe to the selected conversation
  useEffect(() => {
    if (!conversationId) {
      return;
    }

    let subscription;
    let cancelled = false;

    const subscribeToConversation = async () => {
      try {
        subscription = await websocketService.subscribe(
          `/topic/conversations/${conversationId}`,
          (message) => {
            if (cancelled) return;

            console.log("Realtime message:", message);

            setMessages((prevMessages) => [...prevMessages, message]);
          },
        );
      } catch (error) {
        console.error("Failed to subscribe to conversation:", error);
      }
    };
    subscribeToConversation();

    return () => {
      cancelled = true;
      subscription?.unsubscribe();
    };
  }, [conversationId]);

  // Load existing messages
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const loadMessages = async () => {
      setLoading(true);

      try {
        const res =
          await chatService.getAllMessagesInAConversation(conversationId);

        console.log("Message response:", res.data);

        setMessages(res.data.messages);
      } catch (error) {
        console.log(
          "Error getting messages:",
          error?.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [conversationId]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex h-full">
      {/* Conversation Sidebar */}
      <ConversationSidebar />

      {/* Chat Window */}
      {conversationId ? (
        <div className="flex flex-1 flex-col">
          <div className="border-b p-4">
            <h2 className="text-xl font-semibold">Chat</h2>

            <p className="text-sm text-gray-500">
              Conversation ID: {conversationId}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {loading ? (
                <p>Loading Messages ...</p>
              ) : messages.length === 0 ? (
                <p>No messages yet</p>
              ) : (
                messages.map((message) => {
                  const isMine = message.senderId === authUser.userId;

                  return (
                    <div
                      key={message.messageId}
                      className={`flex ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs rounded-lg px-4 py-2 ${
                          isMine
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-black"
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2 border-t p-4">
            <input
              type="text"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              className="flex-1 rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleSend}
              className="rounded-lg bg-blue-500 px-5 py-2 text-white hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center p-4">
          <div className="text-center text-gray-400">
            <p className="text-lg font-medium">Select a conversation</p>

            <p className="mt-1 text-sm">
              Choose a conversation from the sidebar to start chatting
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
