import { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import useAuth from "./useAuth";
import notificationService from "../services/notificationService";
import chatService from "../services/chatService";

export const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [pendingChatRequests, setPendingChatRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      setUnreadCount(0);
      setNotifications([]);
      setPendingChatRequests([]);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const unreadResponse =
          await notificationService.getUnreadNotificationsCount();

        const notificationsResponse =
          await notificationService.getAllNotifications();

        setUnreadCount(unreadResponse.data.data);
        setNotifications(
          notificationsResponse.data.data.allNotificationsResponseList,
        );
      } catch (error) {
        console.error(
          "Failed to load notifications:",
          error.response?.data?.apiError?.message,
        );
      } finally {
        setLoading(false);
      }
    };

    const loadPendingChatRequests = async () => {
      try {
        const pendingChatRequestsResponse =
          await chatService.nearbyChatPendingRequest();

        setPendingChatRequests(
          pendingChatRequestsResponse.data.responseDtoList,
        );
      } catch (error) {
        console.error(
          "Failed to load pending chat requests:",
          error.response?.data?.apiError?.message,
        );
      }
    };

    loadData();
    loadPendingChatRequests();

    const client = new Client({
      webSocketFactory: () =>
        new WebSocket(
          `ws://localhost:9010/api/v1/notification/ws?token=${encodeURIComponent(
            accessToken,
          )}`,
        ),

      reconnectDelay: 5000,

      onConnect: () => {
        console.log("Notification WebSocket connected");

        client.subscribe("/user/queue/notifications", (frame) => {
          const notification = JSON.parse(frame.body);

          console.log("Realtime notification:", notification);

          setNotifications((prev) => [notification, ...prev]);
          setUnreadCount((prev) => prev + 1);

          if (
            notification.notificationType === "NEW_CHAT_REQUEST" &&
            notification.referenceType === "REQUEST"
          ) {
            loadPendingChatRequests();
          }
        });
      },

      onStompError: (frame) => {
        console.error("Notification STOMP error:", frame.headers, frame.body);
      },

      onWebSocketError: (error) => {
        console.error("Notification WebSocket error:", error);
      },

      onWebSocketClose: () => {
        console.log("Notification WebSocket closed");
      },
    });

    client.activate();

    return () => {
      console.log("Disconnecting notification WebSocket");
      client.deactivate();
    };
  }, [accessToken]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        setNotifications,
        setUnreadCount,
        pendingChatRequests,
        setPendingChatRequests,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
