import api from "./api";

export const getAllProperties = async () => {
  const response = await api.get("/api/properties");
  return response.data;
};

export const getPropertiesByOwner = async (ownerId: number | string) => {
  const response = await api.get(`/api/properties/owner/${ownerId}`);
  return response.data;
};

export const createProperty = async (propertyData: any) => {
  const response = await api.post("/api/properties", propertyData);
  return response.data;
};

export const updateProperty = async (id: number | string, propertyData: any) => {
  const response = await api.put(`/api/properties/${id}`, propertyData);
  return response.data;
};

export const deleteProperty = async (id: number | string) => {
  const response = await api.delete(`/api/properties/${id}`);
  return response.data;
};