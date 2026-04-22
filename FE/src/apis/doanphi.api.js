import apiClient from "@/configs/axiosClient";

// ── Mức đoàn phí ─────────────────────────────────────────

export const getMucDoanPhiAPI = async () => {
  const res = await apiClient.get("/doan-phi/muc-phi");
  return res.data;
};

export const createMucDoanPhiAPI = async ({ namHoc, soTien }) => {
  const res = await apiClient.post("/doan-phi/muc-phi", { namHoc, soTien });
  return res.data;
};

export const updateMucDoanPhiAPI = async (idMucDP, data) => {
  const res = await apiClient.put(`/doan-phi/muc-phi/${idMucDP}`, data);
  return res.data;
};

// ── Tình trạng nộp đoàn phí ──────────────────────────────

export const getChiDoanAPI = async () => {
  const res = await apiClient.get("/doan-phi/chi-doan");
  return res.data;
};

export const getDoanPhiStatsAPI = async ({
  idChiDoan = "all",
  namHoc,
} = {}) => {
  const res = await apiClient.get("/doan-phi/stats", {
    params: { idChiDoan, namHoc },
  });
  return res.data;
};

export const getDoanPhiAPI = async ({
  search = "",
  trangThai = "all",
  idChiDoan = "all",
  page = 1,
  limit = 10,
} = {}) => {
  const res = await apiClient.get("/doan-phi", {
    params: { search, trangThai, idChiDoan, page, limit },
  });
  return res.data;
};

// ── Phiếu thu ────────────────────────────────────────────

export const getPhieuThuAPI = async ({ trangThai = "all" } = {}) => {
  const res = await apiClient.get("/doan-phi/phieu-thu", {
    params: { trangThai },
  });
  return res.data;
};

export const createPhieuThuAPI = async ({ listIdDoanPhi, fileDinhKem }) => {
  const res = await apiClient.post("/doan-phi/phieu-thu", {
    listIdDoanPhi,
    fileDinhKem,
  });
  return res.data;
};

export const duyetPhieuThuAPI = async (idPhieuThu, trangThai) => {
  const res = await apiClient.put(`/doan-phi/phieu-thu/${idPhieuThu}`, {
    trangThai,
  });
  return res.data;
};
