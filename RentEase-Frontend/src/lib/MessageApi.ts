import api from "./api";

export const getConversations = async () => {
  const response = await api.get("/api/messages/conversations");
  return response.data;
};

export const getMessagesWithUser = async (otherUserId: number | string) => {
  const response = await api.get(`/api/messages/with/${otherUserId}`);
  return response.data;
};

export const sendMessage = async (receiverId: number | string, content: string) => {
  const response = await api.post("/api/messages", { receiverId, content });
  return response.data;
};

export const markMessagesRead = async (otherUserId: number | string) => {
  const response = await api.put(`/api/messages/read/${otherUserId}`);
  return response.data;
};
