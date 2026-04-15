import axiosClient from "../configs/axiosClient";

const sodoanAPI = {
  getAll: (page = 1, limit = 10) =>
    axiosClient.get(`/sodoan?page=${page}&limit=${limit}`),
  getById: (id) => axiosClient.get(`/sodoan/${id}`),
  updateTrangThai: (id, trangThai) =>
    axiosClient.patch(`/sodoan/${id}/trang-thai`, { trangThai }),
};

export default sodoanAPI;
