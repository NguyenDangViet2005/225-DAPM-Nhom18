import { useState, useMemo } from "react";
import { Calendar, MapPin, Users, Plus, Edit, Trash2 } from "lucide-react";
import {
  MOCK_HOAT_DONG_KHOA,
  MOCK_DANG_KY_HOAT_DONG_KHOA,
  ACTIVITY_STATS_KHOA,
} from "@/data/mockHoatDongKhoa";
import DataTableToolbar from "@/components/commons/DataTableToolbar/DataTableToolbar";
import RegistrationListModal from "@/pages/protected/doantruong/hoat-dong/DanhSachDoanVienDangKiModal";
import "./HoatDongKhoa.css";

const HoatDongKhoaQuanLy = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showRegModal, setShowRegModal] = useState(false);
  const [selectedHD, setSelectedHD] = useState(null);

  const filterOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "Đang mở đăng ký", label: "Đang mở đăng ký" },
    { value: "Đang diễn ra", label: "Đang diễn ra" },
    { value: "Đã kết thúc", label: "Đã kết thúc" },
    { value: "Đã đóng đăng ký", label: "Đã đóng đăng ký" },
  ];

  const filteredActivities = useMemo(() => {
    return MOCK_HOAT_DONG_KHOA.filter((hd) => {
      const matchSearch =
        hd.tenHD.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hd.diaDiem.toLowerCase().includes(searchTerm.toLowerCase());
      const matchFilter =
        statusFilter === "all" || hd.trangThaiHD === statusFilter;
      return matchSearch && matchFilter;
    });
  }, [searchTerm, statusFilter]);

  // Danh sách đã duyệt của hoạt động được chọn
  const approvedRegs = useMemo(() => {
    if (!selectedHD) return [];
    return MOCK_DANG_KY_HOAT_DONG_KHOA.filter(
      (r) => r.idHD === selectedHD.idHD && r.trangThaiDuyet === "Đã duyệt",
    );
  }, [selectedHD]);

  const getBadgeClass = (trangThai) => {
    switch (trangThai) {
      case "Đang mở đăng ký":
        return "hdk-badge--open";
      case "Đang diễn ra":
        return "hdk-badge--ongoing";
      case "Đã kết thúc":
        return "hdk-badge--ended";
      default:
        return "hdk-badge--closed";
    }
  };

  return (
    <div className="hdk-container">
      {/* Header */}
      <div className="hdk-header">
        <h1 className="hdk-title">Quản lý Hoạt động Khoa</h1>
        <div className="hdk-actions">
          <button
            className="hdk-btn"
            style={{
              backgroundColor: "#004f9f",
              borderColor: "#004f9f",
              color: "#fff",
            }}
          >
            <Plus size={18} />
            Tạo hoạt động mới
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="hdk-stats">
        <div className="hdk-stat-item">
          <span className="hdk-stat-item__label">Tổng hoạt động</span>
          <span className="hdk-stat-item__value">
            {ACTIVITY_STATS_KHOA.tongHoatDong}
          </span>
        </div>
        <div className="hdk-stat-item" style={{ borderLeftColor: "#15803d" }}>
          <span className="hdk-stat-item__label">Đang mở đăng ký</span>
          <span className="hdk-stat-item__value" style={{ color: "#15803d" }}>
            {ACTIVITY_STATS_KHOA.dangMo}
          </span>
        </div>
        <div className="hdk-stat-item" style={{ borderLeftColor: "#0369a1" }}>
          <span className="hdk-stat-item__label">Đang diễn ra</span>
          <span className="hdk-stat-item__value" style={{ color: "#0369a1" }}>
            {ACTIVITY_STATS_KHOA.dangDienRa}
          </span>
        </div>
        <div className="hdk-stat-item" style={{ borderLeftColor: "#475569" }}>
          <span className="hdk-stat-item__label">Đã kết thúc</span>
          <span className="hdk-stat-item__value">
            {ACTIVITY_STATS_KHOA.daKetThuc}
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm theo tên hoạt động, địa điểm..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={filterOptions}
      />

      {/* Table */}
      <div className="hdk-card">
        <table className="hdk-table">
          <thead>
            <tr>
              <th>Thông tin hoạt động</th>
              <th>Thời gian & Địa điểm</th>
              <th>Số lượng đăng ký</th>
              <th>Điểm HD</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((hd) => (
              <tr key={hd.idHD}>
                <td className="hdk-name-cell">
                  <span className="hdk-activity-title">{hd.tenHD}</span>
                  <span className="hdk-activity-info">
                    <Users size={12} /> {hd.donViToChuc}
                  </span>
                </td>
                <td>
                  <div className="hdk-activity-info">
                    <Calendar size={13} />
                    {new Date(hd.ngayToChuc).toLocaleDateString("vi-VN")}
                  </div>
                  <div className="hdk-activity-info">
                    <MapPin size={13} /> {hd.diaDiem}
                  </div>
                </td>
                <td>
                  <div
                    className="hdk-activity-info"
                    style={{
                      color: "#004f9f",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedHD(hd);
                      setShowRegModal(true);
                    }}
                  >
                    {hd.soLuongDaDK}/{hd.soLuongMax} (Xem)
                  </div>
                  <div className="hdk-progress-wrap">
                    <div
                      className="hdk-progress-bar"
                      style={{
                        width: `${(hd.soLuongDaDK / hd.soLuongMax) * 100}%`,
                      }}
                    />
                  </div>
                </td>
                <td style={{ fontWeight: 800, color: "#004f9f" }}>
                  {hd.diemHD}
                </td>
                <td>
                  <span
                    className={`hdk-badge ${getBadgeClass(hd.trangThaiHD)}`}
                  >
                    {hd.trangThaiHD}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      className="hdk-btn"
                      title="Xem danh sách đăng ký"
                      onClick={() => {
                        setSelectedHD(hd);
                        setShowRegModal(true);
                      }}
                    >
                      <Users size={15} />
                    </button>
                    <button className="hdk-btn" title="Chỉnh sửa">
                      <Edit size={15} />
                    </button>
                    <button className="hdk-btn" title="Xóa">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredActivities.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    color: "#94a3b8",
                  }}
                >
                  Không tìm thấy hoạt động phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal danh sách đăng ký */}
      <RegistrationListModal
        show={showRegModal}
        onClose={() => setShowRegModal(false)}
        activity={selectedHD}
        registrations={approvedRegs}
        title="Danh sách Đăng ký đã Duyệt"
      />
    </div>
  );
};

export default HoatDongKhoaQuanLy;
