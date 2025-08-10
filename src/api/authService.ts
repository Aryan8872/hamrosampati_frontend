import apiClient from "./apiClient";

interface UserData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const registerUser = async (userData: UserData) => {
  return apiClient.post("/auth/register", userData);
};

export const loginUser = async (credentials: LoginCredentials) => {
  const response = await apiClient.post("/auth/login", credentials);
  const token = response.data.token;

  if (token) {
    localStorage.setItem("token", token);
  }
  return response.data;
};
