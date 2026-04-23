import { useState, useMemo } from "react";
import { Calendar, MapPin, Users, CheckCheck, FileCheck } from "lucide-react";
import {
  MOCK_HOAT_DONG_KHOA,
  MOCK_DANG_KY_HOAT_DONG_KHOA,
  ACTIVITY_STATS_KHOA,
} from "@/data/mockHoatDongKhoa";
import DataTableToolbar from "@/components/commons/DataTableToolbar/DataTableToolbar";
import RegistrationListModal from "@/pages/protected/doantruong/hoat-dong/DanhSachDoanVienDangKiModal";
import "./HoatDongKhoa.css";

const HoatDongKhoaXacNhan = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHD, setSelectedHD] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);

  // Chỉ lấy hoạt động đang diễn ra hoặc đã kết thúc để xác nhận
  const activitiesToConfirm = useMemo(() => {
    return MOCK_HOAT_DONG_KHOA.filter(
      (hd) =>
        (hd.trangThaiHD === "Đang diễn ra" ||
          hd.trangThaiHD === "Đã kết thúc") &&
        hd.tenHD.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  // Danh sách đoàn viên đã duyệt của hoạt động được chọn
  const approvedMembers = useMemo(() => {
    if (!selectedHD) return [];
    return MOCK_DANG_KY_HOAT_DONG_KHOA.filter(
      (r) => r.idHD === selectedHD.idHD && r.trangThaiDuyet === "Đã duyệt",
    );
  }, [selectedHD]);

  return (
    <div className="hdk-container">
      {/* Header */}
      <div className="hdk-header">
        <h1 className="hdk-title">Xác nhận Hoàn thành Hoạt động Khoa</h1>
        <div className="hdk-actions">
          <button
            className="hdk-btn"
            style={{ borderColor: "#004f9f", color: "#004f9f" }}
          >
            <FileCheck size={18} />
            Báo cáo tổng kết
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="hdk-stats">
        <div className="hdk-stat-item" style={{ borderLeftColor: "#0369a1" }}>
          <span className="hdk-stat-item__label">Chờ xác nhận</span>
          <span className="hdk-stat-item__value" style={{ color: "#0369a1" }}>
            {activitiesToConfirm.length} hoạt động
          </span>
        </div>
        <div className="hdk-stat-item" style={{ borderLeftColor: "#15803d" }}>
          <span className="hdk-stat-item__label">Tổng điểm đã cấp</span>
          <span className="hdk-stat-item__value" style={{ color: "#15803d" }}>
            {ACTIVITY_STATS_KHOA.tongDiemDaCap} điểm
          </span>
        </div>
        <div className="hdk-stat-item" style={{ borderLeftColor: "#004f9f" }}>
          <span className="hdk-stat-item__label">Đoàn viên tham gia</span>
          <span className="hdk-stat-item__value">
            {ACTIVITY_STATS_KHOA.tongDoanVienThamGia}
          </span>
        </div>
        <div className="hdk-stat-item" style={{ borderLeftColor: "#475569" }}>
          <span className="hdk-stat-item__label">Đã kết thúc</span>
          <span className="hdk-stat-item__value">
            {ACTIVITY_STATS_KHOA.daKetThuc} hoạt động
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm tên hoạt động để xác nhận..."
      />

      {/* Table */}
      <div className="hdk-card">
        <table className="hdk-table">
          <thead>
            <tr>
              <th>Tên hoạt động</th>
              <th>Thời gian & Địa điểm</th>
              <th>Đã đăng ký</th>
              <th>Đã duyệt tham gia</th>
              <th>Điểm HD</th>
              <th>Xác nhận & Ghi điểm</th>
            </tr>
          </thead>
          <tbody>
            {activitiesToConfirm.map((hd) => {
              const approvedCount = MOCK_DANG_KY_HOAT_DONG_KHOA.filter(
                (r) => r.idHD === hd.idHD && r.trangThaiDuyet === "Đã duyệt",
              ).length;

              return (
                <tr key={hd.idHD}>
                  <td>
                    <span className="hdk-activity-title">{hd.tenHD}</span>
                    <span
                      className={`hdk-badge ${hd.trangThaiHD === "Đang diễn ra" ? "hdk-badge--ongoing" : "hdk-badge--ended"}`}
                      style={{ marginTop: "4px", display: "inline-block" }}
                    >
                      {hd.trangThaiHD}
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
                  <td style={{ textAlign: "center", fontWeight: 600 }}>
                    {hd.soLuongDaDK} SV
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      fontWeight: 700,
                      color: "#15803d",
                    }}
                  >
                    {approvedCount} SV
                  </td>
                  <td
                    style={{
                      fontWeight: 800,
                      color: "#004f9f",
                      textAlign: "center",
                    }}
                  >
                    +{hd.diemHD}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="hdk-btn"
                        title="Xem danh sách tham gia"
                        onClick={() => {
                          setSelectedHD(hd);
                          setShowMemberModal(true);
                        }}
                      >
                        <Users size={16} /> Danh sách
                      </button>
                      <button
                        className="hdk-btn"
                        style={{
                          backgroundColor: "#004f9f",
                          color: "#fff",
                          borderColor: "#004f9f",
                        }}
                        onClick={() =>
                          alert(
                            `Đã xác nhận hoàn thành & cấp ${hd.diemHD} điểm cho "${hd.tenHD}"`,
                          )
                        }
                      >
                        <CheckCheck size={16} /> Xác nhận
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {activitiesToConfirm.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    color: "#94a3b8",
                  }}
                >
                  Không có hoạt động nào cần xác nhận
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal danh sách tham gia */}
      <RegistrationListModal
        show={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        activity={selectedHD}
        registrations={approvedMembers}
        title="Danh sách Tham gia thực tế"
      />
    </div>
  );
};

export default HoatDongKhoaXacNhan;
