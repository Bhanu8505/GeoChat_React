import { Client } from "@stomp/stompjs";

let client = null;

const websocketService = {
  connect: (token, onConnected, onError) => {
    client = new Client({
      webSocketFactory: () =>
        new WebSocket(
          `ws://localhost:9010/api/v1/chat/ws?token=${encodeURIComponent(token)}`,
        ),

      reconnectDelay: 0,

      onConnect: () => {
        console.log("STOMP CONNECTED");

        onConnected?.();
      },

      onStompError: (frame) => {
        console.error("STOMP ERROR:", frame.headers, frame.body);
      },

      onWebSocketError: (error) => {
        console.error("WEBSOCKET ERROR:", error);
        onError?.(error);
      },

      onWebSocketClose: (event) => {
        console.log("WEBSOCKET CLOSED");
        console.log("code:", event.code);
        console.log("reason:", event.reason);
      },
    });

    client.activate();
  },

  subscribe: (destination, callback) => {
    if (!client?.connected) {
      console.log("Cannot subscribe: WebSocket not connected");
      return;
    }

    return client.subscribe(destination, (frame) => {
      console.log("Received:", frame.body);

      callback(JSON.parse(frame.body));
    });
  },
  disconnect: () => {
    if (client) {
      client.deactivate();
      client = null;
    }
  },
  sendMessage: (destination, body) => {
    client.publish({
      destination,
      body: JSON.stringify(body),
    });
  },
};

export default websocketService;
