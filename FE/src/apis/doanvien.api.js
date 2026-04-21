import apiClient from "@/configs/axiosClient";

export const doanvienAPI = {
  // GET /api/doan-vien/me — Lấy thông tin cá nhân
  getMyProfile: async () => {
    const response = await apiClient.get("/doan-vien/me");
    return response.data;
  },

  // PATCH /api/doan-vien/me — Cập nhật thông tin cá nhân
  updateMyProfile: async (data) => {
    const response = await apiClient.patch("/doan-vien/me", data);
    return response.data;
  },
};

export default doanvienAPI;
