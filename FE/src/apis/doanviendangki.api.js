import apiClient from "@/configs/axiosClient";

export const doanviendangkiAPI = {
  // Get all pending registrations for school-level activities (DOANTRUONG only)
  getPendingRegistrationsDoantruong: async () => {
    const response = await apiClient.get(
      "/doanviendangki/doantruong/registrations/pending",
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
};

export default doanviendangkiAPI;
