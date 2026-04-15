import { useState, useCallback } from "react";
import {
  getMucDoanPhiAPI,
  createMucDoanPhiAPI,
  getDoanPhiAPI,
  getDoanPhiStatsAPI,
  getChiDoanAPI,
  getPhieuThuAPI,
  duyetPhieuThuAPI,
} from "@/apis/doanphi.api";

const useDoanPhi = () => {
  const [mucDoanPhi, setMucDoanPhi] = useState([]);
  const [doanPhiList, setDoanPhiList] = useState([]);
  const [phieuThuList, setPhieuThuList] = useState([]);
  const [chiDoanList, setChiDoanList] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Mức đoàn phí ───────────────────────────────────────
  const fetchMucDoanPhi = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMucDoanPhiAPI();
      if (res.success) setMucDoanPhi(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createMucDoanPhi = useCallback(
    async ({ namHoc, soTien }) => {
      try {
        setLoading(true);
        const res = await createMucDoanPhiAPI({ namHoc, soTien });
        if (res.success) await fetchMucDoanPhi();
        return res;
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [fetchMucDoanPhi],
  );

  // ── Chi đoàn ───────────────────────────────────────────
  const fetchChiDoan = useCallback(async () => {
    try {
      const res = await getChiDoanAPI();
      if (res.success) setChiDoanList(res.data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // ── Tình trạng nộp ─────────────────────────────────────
  const fetchDoanPhi = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const [resData, resStats] = await Promise.all([
        getDoanPhiAPI(params),
        getDoanPhiStatsAPI({ idChiDoan: params.idChiDoan }),
      ]);
      if (resData.success) {
        setDoanPhiList(resData.data);
        const paging = resData.pagination || {};
        const page = Number.parseInt(paging.page, 10) || 1;
        const limit = Number.parseInt(paging.limit, 10) || 10;
        const total = Number.parseInt(paging.total, 10) || 0;
        const totalPages =
          Number.parseInt(paging.totalPages, 10) ||
          Math.max(1, Math.ceil(total / limit));
        setPagination({ page, limit, total, totalPages });
      }
      if (resStats.success) setStats(resStats.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Phiếu thu ──────────────────────────────────────────
  const fetchPhieuThu = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const res = await getPhieuThuAPI(params);
      if (res.success) setPhieuThuList(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const duyetPhieuThu = useCallback(
    async (idPhieuThu, trangThai) => {
      try {
        setLoading(true);
        const res = await duyetPhieuThuAPI(idPhieuThu, trangThai);
        if (res.success) await fetchPhieuThu();
        return res;
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [fetchPhieuThu],
  );

  return {
    mucDoanPhi,
    doanPhiList,
    phieuThuList,
    chiDoanList,
    stats,
    pagination,
    loading,
    error,
    fetchMucDoanPhi,
    createMucDoanPhi,
    fetchChiDoan,
    fetchDoanPhi,
    fetchPhieuThu,
    duyetPhieuThu,
  };
};

export default useDoanPhi;
