import { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import useAuth from "./useAuth";
import notificationService from "../services/notificationService";

export const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      setUnreadCount(0);
      return;
    }

    const loadUnreadCount = async () => {
      try {
        const response =
          await notificationService.getUnreadNotificationsCount();

        setUnreadCount(response.data);
      } catch (error) {
        console.error("Failed to get unread count:", error);
      }
    };

    loadUnreadCount();

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
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
