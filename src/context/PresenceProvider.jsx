import { createContext, useEffect, useState } from "react";
import presenceService from "../services/presenceService";
import websocketService from "../services/webSocketService";
import useAuth from "./useAuth";

export const PresenceContext = createContext();

const PresenceProvider = ({ children }) => {
  const { authUser } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!authUser || !token) {
      return;
    }

    let presenceSubscription;

    const initializePresence = async () => {
      try {
        websocketService.connect(
          token,
          async () => {
            console.log("Presence WebSocket connected");

            presenceSubscription = await websocketService.subscribe(
              "/topic/presence",
              (event) => {
                const { userId, status } = event;

                setOnlineUsers((prev) => {
                  const updated = new Set(prev);

                  if (status === "ONLINE") {
                    updated.add(userId);
                  }

                  if (status === "OFFLINE") {
                    updated.delete(userId);
                  }

                  return updated;
                });
              },
            );
          },
          (error) => {
            console.error("Presence WebSocket error:", error);
          },
        );

        // Load initial online users
        const response = await presenceService.getOnlineUsers();

        setOnlineUsers(new Set(response.data));
      } catch (error) {
        console.error("Failed to initialize presence:", error);
      }
    };

    initializePresence();

    return () => {
      presenceSubscription?.unsubscribe();
      websocketService.disconnect();
    };
  }, [authUser]);

  return (
    <PresenceContext.Provider value={{ onlineUsers }}>
      {children}
    </PresenceContext.Provider>
  );
};

export default PresenceProvider;
