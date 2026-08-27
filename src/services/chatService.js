import api from "../utils/api";

const chatService = {
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
};

export default chatService;
