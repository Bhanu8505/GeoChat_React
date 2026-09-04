import api from "../utils/api";

const notificationService = {
  getAllNotifications: () => {
    return api.get("/notification/notifications");
  },

  getUnreadNotifications: () => {
    return api.get("/notification/notifications/unread");
  },

  getUnreadNotificationsCount: () => {
    return api.get("/notification/notifications/unread/count");
  },

  readNotificationById: (notificationId) => {
    return api.patch(`/notification/notifications/read/${notificationId}`);
  },

  readAllNotifications: () => {
    return api.get("/notification/notifications/read-all");
  },

  deleteNotificationById: (notificationId) => {
    return api.delete(`/notification/notifications/${notificationId}`);
  },
};

export default notificationService;
