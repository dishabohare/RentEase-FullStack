import api from "./api";

export const getNotifications = async () => {
  const response = await api.get("/api/notifications");
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.put("/api/notifications/read");
  return response.data;
};

export const markNotificationRead = async (id: number | string) => {
  const response = await api.put(`/api/notifications/${id}/read`);
  return response.data;
};

export const clearAllNotifications = async () => {
  const response = await api.delete("/api/notifications");
  return response.data;
};
