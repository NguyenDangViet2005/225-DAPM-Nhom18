import { useState, useEffect, useMemo } from "react";
import { Download, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import sodoanAPI from "@/apis/sodoan.api";
import DataTableToolbar from "@/components/commons/DataTableToolbar/DataTableToolbar";
import SoDoanTable from "@/components/commons/tables/SoDoanTable";
import SoDoanStatusModal from "./SoDoanStatusModal";
import SoDoanViewModal from "./SoDoanViewModal";
import SoDoanCreateModal from "./SoDoanCreateModal";
import "./SoDoan.css";

const SoDoanQuanLy = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedSoDoan, setSelectedSoDoan] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewSoDoan, setViewSoDoan] = useState(null);
  const [loadingView, setLoadingView] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleViewDetails = async (id) => {
    setViewSoDoan(null);
    setShowViewModal(true);
    setLoadingView(true);
    try {
      const res = await sodoanAPI.getById(id.trim());
      if (res.data && res.data.success) {
        setViewSoDoan(res.data.data);
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tải thông tin sổ đoàn");
    } finally {
      setLoadingView(false);
    }
  };

  const fetchSoDoan = async () => {
    setLoading(true);
    try {
      const res = await sodoanAPI.getAll(currentPage, 10);
      if (res.data && res.data.success) {
        setData(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
        setTotalItems(res.data.pagination.totalItems);
      }
    } catch (err) {
      console.error(err);
      // Removed unused setError
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoDoan();
  }, [currentPage]);

  const handleUpdateStatus = async () => {
    if (!selectedSoDoan || !newStatus) return;
    setUpdating(true);
    try {
      const res = await sodoanAPI.updateTrangThai(
        selectedSoDoan.idSoDoan.trim(),
        newStatus,
      );
      if (res.data && res.data.success) {
        await fetchSoDoan();
        setShowStatusModal(false);
        setSelectedSoDoan(null);
      }
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái", err);
    } finally {
      setUpdating(false);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.doanVien?.hoTen
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.idDV?.includes(searchTerm) ||
        item.idSoDoan?.includes(searchTerm);
      const matchesStatus =
        statusFilter === "all" || item.trangThai === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = totalItems;
    const submitted = data.filter((d) => d.trangThai === "Đã nộp sổ").length;
    const notSubmitted = data.filter(
      (d) => d.trangThai === "Chưa nộp sổ",
    ).length;
    const withdrawn = data.filter((d) => d.trangThai === "Đã rút sổ").length;
    return { total, submitted, notSubmitted, withdrawn };
  }, [data, totalItems]);

  const filterOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "Đã nộp sổ", label: "Đã nộp sổ" },
    { value: "Chưa nộp sổ", label: "Chưa nộp sổ" },
    { value: "Đã rút sổ", label: "Đã rút sổ" },
  ];

  return (
    <div className="so-doan-content">
      <div className="so-doan-header">
        <h2 className="so-doan-content-title">Danh sách Sổ Đoàn hệ thống</h2>
        <div className="so-doan-actions">
          <button className="btn-primary" title="In báo cáo thống kê">
            <Download size={18} />
            Xuất báo cáo
          </button>
          <button 
            className="btn-primary" 
            title="Tiếp nhận sổ mới"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} />
            Tiếp nhận Sổ
          </button>
        </div>
      </div>

      <div className="so-doan-stats">
        <div className="stat-item stat-item--tong">
          <span className="stat-item__label">Tổng số Sổ</span>
          <span className="stat-item__value">
            {stats.total.toLocaleString()}
          </span>
        </div>
        <div className="stat-item stat-item--da-nop">
          <span className="stat-item__label">Đã nộp sổ (Trên trang)</span>
          <span className="stat-item__value">
            {stats.submitted.toLocaleString()}
          </span>
        </div>
        <div className="stat-item stat-item--chua-nop">
          <span className="stat-item__label">Chưa nộp sổ (Trên trang)</span>
          <span className="stat-item__value">
            {stats.notSubmitted.toLocaleString()}
          </span>
        </div>
        <div className="stat-item stat-item--da-rut">
          <span className="stat-item__label">Đã rút sổ (Trên trang)</span>
          <span className="stat-item__value">
            {stats.withdrawn.toLocaleString()}
          </span>
        </div>
      </div>

      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm theo Tên đoàn viên, MSSV hoặc Mã sổ..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={filterOptions}
      />

      <SoDoanTable
        loading={loading}
        filteredData={filteredData}
        handleViewDetails={handleViewDetails}
        setSelectedSoDoan={setSelectedSoDoan}
        setNewStatus={setNewStatus}
        setShowStatusModal={setShowStatusModal}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="btn-icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
            title="Trang trước"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="pagination-text">
            Trang <strong>{currentPage}</strong> / {totalPages}
            <span className="pagination-total">({totalItems} sổ đoàn)</span>
          </span>
          <button
            className="btn-icon"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || loading}
            title="Trang sau"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      <SoDoanStatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        selectedSoDoan={selectedSoDoan}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        onUpdate={handleUpdateStatus}
        updating={updating}
      />

      <SoDoanViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        viewSoDoan={viewSoDoan}
        loadingView={loadingView}
      />

      <SoDoanCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={async (data) => {
          try {
            const res = await sodoanAPI.createSoDoan(data);
            if (res && res.data && res.data.success) {
              alert("Tạo sổ thành công!");
              setShowCreateModal(false);
              fetchSoDoan();
            } else {
              alert("Không tạo được: " + (res?.data?.message || "Lỗi không xác định"));
            }
          } catch (err) {
            console.error(err);
            alert("Lỗi khi tạo sổ đoàn:\n" + (err.response?.data?.message || err.message));
          }
        }}
      />
    </div>
  );
};

export default SoDoanQuanLy;
