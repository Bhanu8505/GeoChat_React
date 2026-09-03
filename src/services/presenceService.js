import api from "../utils/api";

const presenceService = {
  checkOnline: (userId) => {
    return api.get(`/chat/presence/${userId}`);
  },

  getOnlineUsers: () => {
    return api.get(`/chat/presence/online-users`);
  },
};

export default presenceService;
