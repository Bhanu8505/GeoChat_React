import { Client } from "@stomp/stompjs";

let client = null;
let connectionPromise = null;

const websocketService = {
  connect: (token, onConnected, onError) => {
    // Already connected
    if (client?.connected) {
      onConnected?.();
      return;
    }

    // Connection already in progress
    if (connectionPromise) {
      connectionPromise.then(() => {
        onConnected?.();
      });
      return;
    }

    connectionPromise = new Promise((resolve, reject) => {
      client = new Client({
        webSocketFactory: () =>
          new WebSocket(
            `ws://localhost:9010/api/v1/chat/ws?token=${encodeURIComponent(
              token,
            )}`,
          ),

        reconnectDelay: 0,

        onConnect: () => {
          console.log("STOMP CONNECTED");

          resolve();
          onConnected?.();
        },

        onStompError: (frame) => {
          console.error("STOMP ERROR:", frame.headers, frame.body);

          connectionPromise = null;
          reject(frame);
        },

        onWebSocketError: (error) => {
          console.error("WEBSOCKET ERROR:", error);

          connectionPromise = null;
          reject(error);

          onError?.(error);
        },

        onWebSocketClose: (event) => {
          console.log("WEBSOCKET CLOSED");
          console.log("code:", event.code);
          console.log("reason:", event.reason);

          connectionPromise = null;
        },
      });

      client.activate();
    });
  },

  waitForConnection: async () => {
    if (client?.connected) {
      return;
    }

    if (connectionPromise) {
      await connectionPromise;
      return;
    }

    throw new Error("WebSocket is not connected");
  },

  subscribe: async (destination, callback) => {
    await websocketService.waitForConnection();

    return client.subscribe(destination, (frame) => {
      console.log("Received:", frame.body);

      callback(JSON.parse(frame.body));
    });
  },

  disconnect: async () => {
    if (client) {
      client.deactivate();
      client = null;
      connectionPromise = null;
    }
  },

  sendMessage: (destination, body) => {
    if (!client?.connected) {
      console.error("Cannot send message: WebSocket not connected");
      return;
    }

    client.publish({
      destination,
      body: JSON.stringify(body),
    });
  },
};

export default websocketService;
