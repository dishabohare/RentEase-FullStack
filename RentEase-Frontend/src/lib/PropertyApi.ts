import api from "./api";

export const getAllProperties = async () => {
  const response = await api.get("/api/properties");
  return response.data;
};
export const createProperty = async (propertyData: any) => {
  const response = await api.post("/api/properties", propertyData);
  return response.data;
};