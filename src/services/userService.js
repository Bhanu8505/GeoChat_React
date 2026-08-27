import api from "../utils/api.js";

const userService = {
  myProfile: () => {
    return api.get("/users/me", {
      skipRefresh: true,
    });
  },

  updateUser: (data) => {
    return api.put("/users/me", data);
  },

  userProfile: (data) => {
    return api.get(`/users/${data}`);
  },

  getUserByUsername: (username) => {
    return api.get("/users/search", {
      params: { username: username },
    });
  },

  updateLocation: (data) => {
    return api.patch("/users/location", data);
  },

  getNearbyUsers: (data) => {
    return api.post("/users/nearby", data);
  },
};

export default userService;
