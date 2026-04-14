import apiClient from "@/configs/axiosClient";

export const loginAPI = async (tenNguoiDung, matKhau) => {
  const response = await apiClient.post("/auth/login", {
    tenNguoiDung,
    matKhau,
  });
  return response.data;
};

export const refreshTokenAPI = async () => {
  const response = await apiClient.post("/auth/refresh-token", {});
  return response.data;
};

export const logoutAPI = async () => {
  const response = await apiClient.post("/auth/logout", {});
  return response.data;
};

export default apiClient;
