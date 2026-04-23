import React from "react";
import { Calendar, MapPin, Users, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/dateFormat";

const HoatDongTable = ({
  isLoading,
  activities,
  isSchoolLevel,
  onViewRegistrations,
  onOpenEditModal,
  onDeleteActivity,
}) => {
  if (isLoading) {
    return (
      <div
        style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}
      >
        Đang tải hoạt động...
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div
        style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}
      >
        Không có hoạt động nào
      </div>
    );
  }

  return (
    <table className="hd-table">
      <thead>
        <tr>
          <th>Thông tin hoạt động</th>
          <th>Thời gian & Địa điểm</th>
          <th>Số lượng đăng ký</th>
          <th>Trạng thái</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {activities.map((hd) => (
          <tr key={hd.idHD}>
            <td className="hd-name-cell">
              <span className="hd-activity-title">{hd.tenHD}</span>
              <span className="hd-activity-info">
                <Users size={12} /> {hd.donViToChuc}
              </span>
            </td>
            <td>
              <div className="hd-activity-info">
                <Calendar size={14} /> {formatDate(hd.ngayToChuc)}
              </div>
              <div className="hd-activity-info">
                <MapPin size={14} /> {hd.diaDiem}
              </div>
            </td>
            <td>
              <div
                className="hd-activity-info"
                style={{
                  justifyContent: "space-between",
                  cursor: "pointer",
                  color: "#004f9f",
                  fontWeight: 700,
                }}
                onClick={() => onViewRegistrations(hd)}
              >
                <span>
                  {hd.soLuongDaDK || 0}/{hd.soLuongMax} (Xem)
                </span>
              </div>
              <div className="hd-progress-wrap">
                <div
                  className="hd-progress-bar"
                  style={{
                    width: `${Math.min(100, ((hd.soLuongDaDK || 0) / hd.soLuongMax) * 100)}%`,
                  }}
                />
              </div>
            </td>
            <td>
              <span
                className={`hd-badge ${
                  hd.trangThaiHD?.trim() === "Đã duyệt"
                    ? "hd-badge--activity-approved"
                    : "hd-badge--activity-unapproved"
                }`}
              >
                {hd.trangThaiHD?.trim()}
              </span>
            </td>
            <td>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="hd-update-btn"
                  title="Danh sách đăng ký"
                  onClick={() => onViewRegistrations(hd)}
                >
                  <Users size={16} />
                </button>
                {isSchoolLevel(hd) && (
                  <>
                    <button
                      className="hd-update-btn"
                      title="Chỉnh sửa"
                      onClick={() => onOpenEditModal(hd)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="hd-update-btn"
                      title="Xóa"
                      onClick={() => onDeleteActivity(hd)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HoatDongTable;
