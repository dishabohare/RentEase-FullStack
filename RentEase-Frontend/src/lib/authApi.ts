import api from "./api";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;   // "OWNER" | "TENANT" | "ADMIN"
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// POST /api/auth/login
export const loginApi = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });
  return response.data;
};

// POST /api/auth/register
export const registerApi = async (
  name: string,
  email: string,
  password: string,
  role: string,
  phone?: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/register", {
    name,
    email,
    password,
    role,
    phone,
  });
  return response.data;
};
