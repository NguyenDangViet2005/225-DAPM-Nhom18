import apiClient from "@/configs/axiosClient";

const BASE = "/tai-khoan";

/**
 * Lấy thống kê tổng quan tài khoản
 */
export const getTaiKhoanStatsAPI = async () => {
  const res = await apiClient.get(`${BASE}/stats`);
  return res.data;
};

/**
 * Lấy danh sách vai trò (cho dropdown)
 */
export const getAllVaiTroAPI = async () => {
  const res = await apiClient.get(`${BASE}/vai-tro/list`);
  return res.data;
};

/**
 * Lấy danh sách Đoàn viên chưa có tài khoản (cho dropdown)
 * @param {string|null} excludeIdDV - ID đoàn viên được loại trừ khỏi điều kiện lọc (khi edit)
 */
export const getDoanVienDropdownAPI = async (excludeIdDV = null) => {
  const params = excludeIdDV ? { excludeIdDV } : {};
  const res = await apiClient.get(`${BASE}/dropdown/doan-vien`, { params });
  return res.data;
};

/**
 * Lấy danh sách Khoa (cho dropdown)
 */
export const getKhoaDropdownAPI = async () => {
  const res = await apiClient.get(`${BASE}/dropdown/khoa`);
  return res.data;
};

/**
 * Lấy danh sách tài khoản
 * @param {Object} params - { page, limit, search, idVaiTro }
 */
export const getAllTaiKhoanAPI = async (params = {}) => {
  const res = await apiClient.get(BASE, { params });
  return res.data;
};

/**
 * Lấy chi tiết một tài khoản
 * @param {string} id - idUser
 */
export const getTaiKhoanByIdAPI = async (id) => {
  const res = await apiClient.get(`${BASE}/${id}`);
  return res.data;
};

/**
 * Tạo tài khoản mới
 * @param {Object} data - { tenNguoiDung, matKhau, idVaiTro, idDV?, idKhoa? }
 */
export const createTaiKhoanAPI = async (data) => {
  const res = await apiClient.post(BASE, data);
  return res.data;
};

/**
 * Cập nhật tài khoản
 * @param {string} id - idUser
 * @param {Object} data - { tenNguoiDung?, idVaiTro?, idDV?, idKhoa?, trangThai? }
 */
export const updateTaiKhoanAPI = async (id, data) => {
  const res = await apiClient.put(`${BASE}/${id}`, data);
  return res.data;
};

/**
 * Đặt lại mật khẩu
 * @param {string} id - idUser
 * @param {string} matKhauMoi - mật khẩu mới
 */
export const resetPasswordAPI = async (id, matKhauMoi) => {
  const res = await apiClient.patch(`${BASE}/${id}/reset-password`, { matKhauMoi });
  return res.data;
};

/**
 * Khóa / Mở khóa tài khoản
 * @param {string} id - idUser
 */
export const toggleTrangThaiAPI = async (id) => {
  const res = await apiClient.patch(`${BASE}/${id}/toggle-status`);
  return res.data;
};
