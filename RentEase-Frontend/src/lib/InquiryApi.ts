import api from "./api";

export interface InquiryData {
  propertyId: number | string;
  message: string;
  visitDate: string;
  visitTime?: string;
  phone: string;
  status?: string;
}

export const submitInquiry = async (data: InquiryData) => {
  const response = await api.post("/inquiries", data);
  return response.data;
};

export const getOwnerInquiries = async () => {
  const response = await api.get("/api/inquiries/owner");
  return response.data;
};

export const getTenantInquiries = async () => {
  const response = await api.get("/api/inquiries/tenant");
  return response.data;
};
