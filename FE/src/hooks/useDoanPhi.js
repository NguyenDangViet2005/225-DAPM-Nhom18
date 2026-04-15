import { useState, useCallback } from "react";
import {
  getMucDoanPhiAPI,
  createMucDoanPhiAPI,
  getDoanPhiAPI,
  getPhieuThuAPI,
  duyetPhieuThuAPI,
} from "@/apis/doanphi.api";

const useDoanPhi = () => {
  const [mucDoanPhi, setMucDoanPhi]   = useState([]);
  const [doanPhiList, setDoanPhiList] = useState([]);
  const [phieuThuList, setPhieuThuList] = useState([]);
  const [pagination, setPagination]   = useState({ page: 1, limit: 20, total: 0 });
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

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

  const createMucDoanPhi = useCallback(async ({ namHoc, soTien }) => {
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
  }, [fetchMucDoanPhi]);

  // ── Tình trạng nộp ─────────────────────────────────────
  const fetchDoanPhi = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const res = await getDoanPhiAPI(params);
      if (res.success) {
        setDoanPhiList(res.data);
        setPagination(res.pagination);
      }
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

  const duyetPhieuThu = useCallback(async (idPhieuThu, trangThai) => {
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
  }, [fetchPhieuThu]);

  return {
    mucDoanPhi, doanPhiList, phieuThuList, pagination,
    loading, error,
    fetchMucDoanPhi, createMucDoanPhi,
    fetchDoanPhi,
    fetchPhieuThu, duyetPhieuThu,
  };
};

export default useDoanPhi;
