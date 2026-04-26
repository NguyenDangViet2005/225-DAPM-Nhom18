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

  // POST /api/doan-vien/me/upload-photo — Upload ảnh thẻ
  uploadPhoto: async (file) => {
    const formData = new FormData();
    formData.append("anhThe", file);
    const response = await apiClient.post("/doan-vien/me/upload-photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // GET /api/doan-vien/so-doan — Lấy thông tin sổ đoàn của đoàn viên
  getMySoDoan: async () => {
    const response = await apiClient.get("/doan-vien/so-doan");
    return response.data;
  },

  // GET /api/doan-vien — Lấy danh sách đoàn viên (phân trang)
  getAll: async (page = 1, limit = 10, search = "") => {
    const response = await apiClient.get("/doan-vien", {
      params: { page, limit, search },
    });
    return response.data;
  },

  // GET /api/doan-vien/stats — Lấy thống kê đoàn viên
  getStats: async () => {
    const response = await apiClient.get("/doan-vien/stats");
    return response.data;
  },

  // GET /api/doan-vien/chi-doan — Lấy danh sách chi đoàn
  getChiDoanList: async () => {
    const response = await apiClient.get("/doan-vien/chi-doan");
    return response.data;
  },

  // POST /api/doan-vien — Tạo đoàn viên mới
  createDoanVien: async (data) => {
    const response = await apiClient.post("/doan-vien", data);
    return response.data;
  },

  // PUT /api/doan-vien/:id — Cập nhật đoàn viên
  updateDoanVien: async (id, data) => {
    const response = await apiClient.put(`/doan-vien/${id}`, data);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/doan-vien/${id}`);
    return response;
  },

  // GET /api/doan-vien/:id/full-detail — Lấy thông tin đầy đủ đoàn viên
  getFullDetail: async (id) => {
    const response = await apiClient.get(`/doan-vien/${id}/full-detail`);
    return response.data;
  },
};

export default doanvienAPI;
