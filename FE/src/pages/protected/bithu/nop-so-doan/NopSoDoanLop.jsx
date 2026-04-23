import { useState, useEffect } from "react";
import sodoanAPI from "@/apis/sodoan.api";
import {  UserCheck, BookOpen, AlertCircle, CheckCircle, Search } from "lucide-react";
import { getErrorMessage } from "@/utils";
import { SO_DOAN_STATUS } from "@/constants";
import NopSoDoanTable from "./NopSoDoanTable";
import "./NopSoDoanLop.css";

const NopSoDoanLop = () => {
  const [danhSach, setDanhSach] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDanhSach = async () => {
    setLoading(true);
    try {
      const response = await sodoanAPI.getLopSoDoan();
      const res = response.data;
      if (res.success) {
        setDanhSach(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDanhSach();
  }, []);

  const handleToggleSelect = (item) => {
    const idToToggle = item.idSoDoan || item.idDV;
    setSelectedIds((prev) =>
      prev.includes(idToToggle)
        ? prev.filter((id) => id !== idToToggle)
        : [...prev, idToToggle]
    );
  };

  const handleSelectAll = (filteredList) => {
    const chuaNopIds = filteredList
      .filter((s) => s.trangThai === SO_DOAN_STATUS.CHUA_NOP)
      .map((s) => s.idSoDoan || s.idDV);

    if (selectedIds.length === chuaNopIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(chuaNopIds);
    }
  };

  const handleSubmit = async () => {
    if (selectedIds.length === 0) return;

    if (!window.confirm(`Bạn có chắc chắn gửi ${selectedIds.length} sổ đoàn này đi để chờ duyệt?`)) {
      return;
    }

    try {
      const response = await sodoanAPI.submitLopSoDoan(selectedIds);
      const res = response.data;
      if (res.success) {
        setSuccessMsg("Gửi danh sách nộp sổ thành công, đang chờ đoàn trường duyệt.");
        setSelectedIds([]);
        fetchDanhSach();
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const currentList = danhSach.filter(
    (item) =>
      item.doanVien?.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.doanVien?.idDV.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filterChuaNop = currentList.filter((s) => s.trangThai === SO_DOAN_STATUS.CHUA_NOP);
  const isAllSelected = selectedIds.length > 0 && selectedIds.length === filterChuaNop.length;

  return (
    <div className="nop-so-doan-lop-container">
      <div className="nsd-header">
        <h1 className="nsd-title">
          <BookOpen size={24} /> Nộp sổ đoàn lớp
        </h1>
        <p className="nsd-subtitle">Quản lý và cập nhật danh sách nộp sổ đoàn của chi đoàn</p>
      </div>

      {error && (
        <div className="nsd-alert error">
          <AlertCircle size={18} /> <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="nsd-alert success">
          <CheckCircle size={18} /> <span>{successMsg}</span>
        </div>
      )}

      <div className="nsd-card">
        <div className="nsd-toolbar">
          <div className="nsd-search">
            <Search size={18} className="nsd-search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã SV, họ tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="nsd-btn-submit"
            onClick={handleSubmit}
            disabled={selectedIds.length === 0 || loading}
          >
            <UserCheck size={18} />
            Đã nộp, gửi duyệt ({selectedIds.length})
          </button>
        </div>

        <NopSoDoanTable
          currentList={currentList}
          selectedIds={selectedIds}
          handleToggleSelect={handleToggleSelect}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default NopSoDoanLop;
