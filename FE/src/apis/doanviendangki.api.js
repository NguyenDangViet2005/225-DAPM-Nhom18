import apiClient from "@/configs/axiosClient";

export const doanviendangkiAPI = {
  // ── Đoàn viên ────────────────────────────────────────────
  getAvailableActivities: async () => {
    const response = await apiClient.get("/doanviendangki/available");
    return response.data;
  },

  dangKyHoatDong: async (idHD) => {
    const response = await apiClient.post(`/doanviendangki/${idHD}/dang-ky`);
    return response.data;
  },

  huyDangKy: async (idHD) => {
    const response = await apiClient.delete(`/doanviendangki/${idHD}/huy`);
    return response.data;
  },

  // Get tất cả đơn đăng ký (mọi trạng thái) hoạt động Đoàn Trường
  getAllRegistrationsDoantruong: async () => {
    const response = await apiClient.get(
      "/doanviendangki/doantruong/registrations/all",
    );
    return response.data;
  },
  // Get all pending registrations for school-level activities (DOANTRUONG only)
  getPendingRegistrationsDoantruong: async () => {
    const response = await apiClient.get(
      "/doanviendangki/doantruong/registrations/pending",
    );
    return response.data;
  },
  // Get dashboard aggregate data for DOANTRUONG
  getDoanTruongDashboard: async () => {
    const response = await apiClient.get(
      "/doanviendangki/doantruong/dashboard",
    );
    return response.data;
  },
  // Duyệt hoặc từ chối đăng ký (moved to doanviendangki routes)
  duyetDangKy: async (idHD, maSV, trangThai, lyDo = null) => {
    const response = await apiClient.put(
      `/doanviendangki/doantruong/${idHD}/duyet`,
      {
        maSV,
        trangThai,
        lyDo,
      },
    );
    return response.data;
  },

  // Get all registrations for a specific activity (all statuses)
  getActivityRegistrations: async (idHD) => {
    const response = await apiClient.get(
      `/doanviendangki/${idHD}/registrations`,
    );
    return response.data;
  },

  // Get only approved registrations for a specific activity (trangThaiDuyet = "Đã duyệt")
  getApprovedActivityRegistrations: async (idHD) => {
    const response = await apiClient.get(
      `/doanviendangki/${idHD}/approved-registrations`,
    );
    return response.data;
  },
};

export default doanviendangkiAPI;
