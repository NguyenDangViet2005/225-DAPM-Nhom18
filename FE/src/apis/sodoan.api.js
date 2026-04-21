import axiosClient from "../configs/axiosClient";

const sodoanAPI = {
  getLopSoDoan: () => axiosClient.get(`/sodoan/lop/ds`),
  submitLopSoDoan: (idSoDoans) =>
    axiosClient.patch(`/sodoan/lop/nop`, { idSoDoans }),
  getSoDoanChoDuyet: () => axiosClient.get(`/sodoan/ds/cho-duyet`),
  duyetSoDoanLop: (idSoDoans, trangThai) =>
    axiosClient.patch(`/sodoan/ds/cho-duyet`, { idSoDoans, trangThai }),
  getAll: (page = 1, limit = 10) =>
    axiosClient.get(`/sodoan?page=${page}&limit=${limit}`),
  getById: (id) => axiosClient.get(`/sodoan/${id}`),
  createSoDoan: (data) => axiosClient.post(`/sodoan/tao-moi`, data),
  updateTrangThai: (id, trangThai) =>
    axiosClient.patch(`/sodoan/${id}/trang-thai`, { trangThai }),
};

export default sodoanAPI;
