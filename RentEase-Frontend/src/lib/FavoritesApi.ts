import api from "./api";

export const getFavorites = async () => {
  const response = await api.get("/api/favorites");
  return response.data;
};

export const getFavoriteIds = async () => {
  const response = await api.get("/api/favorites/ids");
  return response.data;
};

export const addFavorite = async (propertyId: number | string) => {
  const response = await api.post(`/api/favorites/${propertyId}`);
  return response.data;
};

export const removeFavorite = async (propertyId: number | string) => {
  const response = await api.delete(`/api/favorites/${propertyId}`);
  return response.data;
};
