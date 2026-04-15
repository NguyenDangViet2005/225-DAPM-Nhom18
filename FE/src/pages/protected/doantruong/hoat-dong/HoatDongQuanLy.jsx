import { useState, useEffect } from "react";
import { Plus, BarChart, ChevronLeft, ChevronRight } from "lucide-react";
import hoatdongAPI from "@/apis/hoatdong.api";
import DataTableToolbar from "@/components/commons/DataTableToolbar/DataTableToolbar";
import RegistrationListModal from "@/components/commons/modals/DanhSachDoanVienDangKiModal";
import HoatDongModal from "@/components/commons/modals/HoatDongModal";
import DeleteConfirmModal from "@/components/commons/modals/DeleteConfirmModal";
import HoatDongTable from "../../../../components/commons/tables/HoatDongTable";
import "./HoatDong.css";

const PAGE_SIZE = 10;

const HoatDongQuanLy = () => {
  const [activities, setActivities] = useState([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    page: 1,
    limit: PAGE_SIZE,
  });

  // Tab mode
  const [tabMode, setTabMode] = useState("doantruong"); // doantruong, khoa, chidoan

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [hdFilter, setHdFilter] = useState("all");

  // Modals
  const [showRegModal, setShowRegModal] = useState(false);
  const [selectedHD, setSelectedHD] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);

  const [showHDModal, setShowHDModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [isSavingActivity, setIsSavingActivity] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingActivity, setDeletingActivity] = useState(null);
  const [isDeletingActivity, setIsDeletingActivity] = useState(false);

  useEffect(() => {
    loadActivities(currentPage);
  }, [currentPage, tabMode]);

  const loadActivities = async (page = 1) => {
    try {
      setIsLoadingActivities(true);
      setError(null);
      let result;
      if (tabMode === "doantruong") {
        result = await hoatdongAPI.getAllSchoolActivities({
          page,
          limit: PAGE_SIZE,
        });
      } else if (tabMode === "khoa") {
        result = await hoatdongAPI.getAllKhoaActivities({
          page,
          limit: PAGE_SIZE,
        });
      } else if (tabMode === "chidoan") {
        result = await hoatdongAPI.getAllChidoanActivities({
          page,
          limit: PAGE_SIZE,
        });
      }

      if (result && result.success) {
        setActivities(result.data || []);
        if (result.pagination) setPagination(result.pagination);
      } else {
        setError(result?.message || "Không thể tải danh sách hoạt động");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Lỗi khi tải hoạt động",
      );
    } finally {
      setIsLoadingActivities(false);
    }
  };

  // Client-side filter within current page data
  const filteredActivities = activities.filter((hd) => {
    const matchesSearch =
      hd.tenHD.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hd.donViToChuc?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      hdFilter === "all" || hd.trangThaiHD?.trim() === hdFilter;
    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "Đã duyệt", label: "Đã duyệt" },
    { value: "Chưa duyệt", label: "Chưa duyệt" },
  ];

  // Only school-level activities (no idKhoa, no idChiDoan) can be edited/deleted
  const isSchoolLevel = (hd) => !hd.idKhoa && !hd.idChiDoan;

  const handleOpenCreateModal = () => {
    setEditingActivity(null);
    setShowHDModal(true);
  };

  const handleOpenEditModal = (activity) => {
    setEditingActivity(activity);
    setShowHDModal(true);
  };

  const handleSaveActivity = async (formData) => {
    try {
      setIsSavingActivity(true);
      const result = editingActivity
        ? await hoatdongAPI.updateActivity(editingActivity.idHD, formData)
        : await hoatdongAPI.createActivity(formData);

      if (result.success) {
        await loadActivities(currentPage);
        setShowHDModal(false);
        setEditingActivity(null);
      } else {
        setError(result.message || "Không thể lưu hoạt động");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Lỗi khi lưu hoạt động",
      );
    } finally {
      setIsSavingActivity(false);
    }
  };

  const handleDeleteActivity = (activity) => {
    setDeletingActivity(activity);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeletingActivity(true);
      const result = await hoatdongAPI.deleteActivity(deletingActivity.idHD);
      if (result.success) {
        const newPage =
          activities.length === 1 && currentPage > 1
            ? currentPage - 1
            : currentPage;
        setCurrentPage(newPage);
        await loadActivities(newPage);
        setShowDeleteModal(false);
        setDeletingActivity(null);
      } else {
        setError(result.message || "Không thể xóa hoạt động");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Lỗi khi xóa hoạt động",
      );
    } finally {
      setIsDeletingActivity(false);
    }
  };

  const handleViewRegistrations = (activity) => {
    setSelectedHD(activity);
    setShowRegModal(true);
    loadRegistrations(activity.idHD);
  };

  const loadRegistrations = async (idHD) => {
    try {
      setIsLoadingRegistrations(true);
      const result = await hoatdongAPI.getActivityRegistrations(idHD);
      if (result.success) {
        setRegistrations(result.data || []);
      } else {
        setError(result.message || "Không thể tải danh sách đăng ký");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Lỗi khi tải đăng ký",
      );
    } finally {
      setIsLoadingRegistrations(false);
    }
  };

  return (
    <div className="hd-container">
      {/* Header */}
      <div className="hd-header">
        <h1 className="hd-title">Quản lý Hoạt động</h1>
        <div className="hd-actions">
          <button
            className="hd-update-btn"
            style={{ borderColor: "#004f9f", color: "#004f9f" }}
          >
            <BarChart size={18} /> Thống kê chung
          </button>
          <button
            className="hd-update-btn"
            style={{
              backgroundColor: "#004f9f",
              borderColor: "#004f9f",
              color: "#fff",
            }}
            onClick={handleOpenCreateModal}
          >
            <Plus size={18} /> Tạo hoạt động mới
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            borderRadius: "6px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      {/* Tabs Navigation */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #eef2f6",
          marginBottom: "1.5rem",
        }}
      >
        <button
          onClick={() => {
            setTabMode("doantruong");
            setCurrentPage(1);
          }}
          style={{
            padding: "1rem 1.5rem",
            background: "none",
            border: "none",
            borderBottom:
              tabMode === "doantruong"
                ? "3px solid #004f9f"
                : "3px solid transparent",
            fontWeight: 700,
            color: tabMode === "doantruong" ? "#004f9f" : "#64748b",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Hoạt động Đoàn Trường
        </button>
        <button
          onClick={() => {
            setTabMode("khoa");
            setCurrentPage(1);
          }}
          style={{
            padding: "1rem 1.5rem",
            background: "none",
            border: "none",
            borderBottom:
              tabMode === "khoa"
                ? "3px solid #004f9f"
                : "3px solid transparent",
            fontWeight: 700,
            color: tabMode === "khoa" ? "#004f9f" : "#64748b",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Hoạt động Đoàn Khoa
        </button>
        <button
          onClick={() => {
            setTabMode("chidoan");
            setCurrentPage(1);
          }}
          style={{
            padding: "1rem 1.5rem",
            background: "none",
            border: "none",
            borderBottom:
              tabMode === "chidoan"
                ? "3px solid #004f9f"
                : "3px solid transparent",
            fontWeight: 700,
            color: tabMode === "chidoan" ? "#004f9f" : "#64748b",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Hoạt động Chi Đoàn
        </button>
      </div>

      {/* Stats */}
      <div className="hd-stats">
        <div className="hd-stat-item">
          <span className="hd-stat-item__label">Tổng hoạt động</span>
          <span className="hd-stat-item__value">{pagination.total}</span>
        </div>
        <div
          className="hd-stat-item"
          style={{ borderLeft: "3px solid #15803d" }}
        >
          <span className="hd-stat-item__label">Đã duyệt</span>
          <span className="hd-stat-item__value">
            {
              activities.filter((a) => a.trangThaiHD?.trim() === "Đã duyệt")
                .length
            }
          </span>
        </div>
        <div
          className="hd-stat-item"
          style={{ borderLeft: "3px solid #0369a1" }}
        >
          <span className="hd-stat-item__label">Chờ duyệt</span>
          <span className="hd-stat-item__value">
            {
              activities.filter((a) => a.trangThaiHD?.trim() === "Chưa duyệt")
                .length
            }
          </span>
        </div>
        <div
          className="hd-stat-item"
          style={{ borderLeft: "3px solid #b45309" }}
        >
          <span className="hd-stat-item__label">Đang mở đăng ký</span>
          <span className="hd-stat-item__value">
            {activities.filter((a) => a.trangThai?.trim() === "Đang mở").length}
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm theo tên hoạt động, đơn vị tổ chức..."
        filterValue={hdFilter}
        onFilterChange={setHdFilter}
        filterOptions={filterOptions}
      />

      {/* Table Card */}
      <div className="hd-card">
        <HoatDongTable
          isLoading={isLoadingActivities}
          activities={filteredActivities}
          isSchoolLevel={isSchoolLevel}
          onViewRegistrations={handleViewRegistrations}
          onOpenEditModal={handleOpenEditModal}
          onDeleteActivity={handleDeleteActivity}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "8px",
              padding: "16px",
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <button
              className="hd-update-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoadingActivities}
              title="Trang trước"
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: "14px", color: "#4a5568" }}>
              Trang <strong>{currentPage}</strong> / {pagination.totalPages}
              <span style={{ marginLeft: "8px", color: "#94a3b8" }}>
                ({pagination.total} hoạt động)
              </span>
            </span>
            <button
              className="hd-update-btn"
              onClick={() =>
                setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={
                currentPage === pagination.totalPages || isLoadingActivities
              }
              title="Trang sau"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <HoatDongModal
        show={showHDModal}
        onClose={() => {
          setShowHDModal(false);
          setEditingActivity(null);
        }}
        onSave={handleSaveActivity}
        activity={editingActivity}
        isLoading={isSavingActivity}
      />

      <DeleteConfirmModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingActivity(null);
        }}
        onConfirm={handleConfirmDelete}
        activityName={deletingActivity?.tenHD}
        isLoading={isDeletingActivity}
      />

      <RegistrationListModal
        show={showRegModal}
        onClose={() => {
          setShowRegModal(false);
          setSelectedHD(null);
          setRegistrations([]);
        }}
        activity={selectedHD}
        registrations={registrations}
        isLoading={isLoadingRegistrations}
        title="Danh sách Đăng ký"
      />
    </div>
  );
};

export default HoatDongQuanLy;
