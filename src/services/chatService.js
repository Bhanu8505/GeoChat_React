import api from "../utils/api";

const chatService = {
  nearbyChatRequest: (data) => {
    return api.post("/chat/conversations/nearby-chat/request", data);
  },
  nearbyChatRequestAccept: (requestId) => {
    return api.patch(`/chat/conversations/nearby-chat/${requestId}/accept`);
  },
  nearbyChatRequestReject: (requestId) => {
    return api.patch(`/chat/conversations/nearby-chat/${requestId}/reject`);
  },
  nearbyChatPendingRequest: () => {
    return api.get("/chat/conversations/near-by/chat/request/pending");
  },

  createConversation: (data) => {
    return api.post("/chat/conversations/createchat", data);
  },

  getConversationById: (conversationId) => {
    return api.get(`/chat/conversations/${conversationId}`);
  },

  getAllConversations: () => {
    return api.get("/chat/conversations/getallconversations");
  },

  addMembersInChat: (data, conversationId) => {
    return api.post(`/chat/conversations/addmembers/${conversationId}`, data);
  },

  createNearbyChat: (data) => {
    return api.post("/chat/conversations/createnearbychat", data);
  },

  sendMessage: (data, conversationId) => {
    return api.post(`/chat/conversations/${conversationId}/sendmessage`, data);
  },

  getAllMessagesInAConversation: (conversationId) => {
    return api.get(
      `/chat/conversations/${conversationId}/getallmessagesinchat`,
    );
  },

  getUserPresence: (userId) => {
    return api.get(`/chat/presence/${userId}`);
  },
};

export default chatService;
