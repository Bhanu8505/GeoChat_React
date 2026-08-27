import api from "../utils/api.js";

const authService = {
  register: (data) => {
    return api.post("/auth/register", data);
  },

  login: (data) => {
    return api.post("/auth/login", data);
  },

  logout: () => {
    return api.post("/auth/logout");
  },

  refreshToken: () => {
    return api.post("/auth/refreshToken");
  },

  // getCurrentUser: ()=>{
  //     return api.get()
  // },
};

export default authService;
