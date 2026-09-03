import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    const isAuthRequest =
      config.url.startsWith("/auth/login") ||
      config.url.startsWith("/auth/register") ||
      config.url.startsWith("/auth/refreshtoken");

    if (token && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log("Inside Api Interceptor Success Response");
    return response;
  },

  async (error) => {
    console.log("Inside Api Interceptor Failed Response");

    const originalRequest = error.config;

    console.log("401 CHECK");
    console.log("status:", error.response?.status);
    console.log("_retry:", originalRequest?._retry);
    console.log("url:", originalRequest?.url);
    console.log("skipRefresh:", originalRequest?.skipRefresh);
    console.log("Error :", error);

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refreshtoken") &&
      !originalRequest.skipRefresh &&
      !originalRequest.url.includes("/auth/logout")
    ) {
      originalRequest._retry = true;

      try {
        console.log("Calling refresh token...");
        const response = await api.post("/auth/refreshtoken");

        console.log("Refresh response:", response.data);

        const newAccessToken = response.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        window.dispatchEvent(
          new CustomEvent("accessTokenUpdated", {
            detail: newAccessToken,
          }),
        );

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        console.log("Retrying:", originalRequest.url);

        return api(originalRequest);
      } catch (refreshError) {
        console.log("Refresh token failed");

        localStorage.removeItem("accessToken");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
