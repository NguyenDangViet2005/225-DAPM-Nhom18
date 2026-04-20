import apiClient from "@/configs/axiosClient";

export const hoatdongAPI = {
  // Get all school-level activities
  getAllSchoolActivities: async ({ page = 1, limit = 10 } = {}) => {
    const response = await apiClient.get("/hoatdong/doantruong", {
      params: { page, limit },
    });
    return response.data;
  },

  // Get all khoa-level activities
  getAllKhoaActivities: async ({ page = 1, limit = 10 } = {}) => {
    const response = await apiClient.get("/hoatdong/khoa/", {
      params: { page, limit },
    });
    return response.data;
  },

  // Get all chi doan-level activities
  getAllChidoanActivities: async ({ page = 1, limit = 10 } = {}) => {
    const response = await apiClient.get("/hoatdong/chidoan/", {
      params: { page, limit },
    });
    return response.data;
  },

  // Get activity by ID
  getActivityById: async (idHD) => {
    const response = await apiClient.get(`/hoatdong/${idHD}`);
    return response.data;
  },

  // Create new activity
  createActivity: async (activityData) => {
    const response = await apiClient.post("/hoatdong", activityData);
    return response.data;
  },

  // Update activity
  updateActivity: async (idHD, updateData) => {
    const response = await apiClient.put(`/hoatdong/${idHD}`, updateData);
    return response.data;
  },

  // Delete activity
  deleteActivity: async (idHD) => {
    const response = await apiClient.delete(`/hoatdong/${idHD}`);
    return response.data;
  },

  // Xác nhận hoàn thành hoạt động & cộng điểm
  xacNhanHoanThanh: async (idHD) => {
    const response = await apiClient.put(`/hoatdong/${idHD}/xac-nhan`);
    return response.data;
  },

  // Get danh sách đăng ký của 1 hoạt động (bao gồm thông tin chi đoàn)
  getDanhSachDangKy: async (idHD) => {
    const response = await apiClient.get(`/hoatdong/${idHD}/registrations`);
    return response.data;
  },

  // Get danh sách yêu cầu mở hoạt động (dành cho Đoàn Trường phê duyệt)
  getYeuCauActivities: async ({ page = 1, limit = 10, status = 'all' } = {}) => {
    const response = await apiClient.get('/hoatdong/yeu-cau', {
      params: { page, limit, status }
    });
    return response.data;
  },

  // Phê duyệt yêu cầu mở hoạt động
  approveYeuCau: async (idHD) => {
    const response = await apiClient.put(`/hoatdong/${idHD}/duyet`);
    return response.data;
  },

  // Từ chối yêu cầu mở hoạt động
  rejectYeuCau: async (idHD) => {
    const response = await apiClient.put(`/hoatdong/${idHD}/tu-choi`);
    return response.data;
  }
};

export default hoatdongAPI;
