import { useState, useMemo } from "react";
import { Search, Filter, BarChart, UserCheck } from "lucide-react";
import { MOCK_DANG_KY_HOAT_DONG } from "@/data/mockHoatDong";
import "./HoatDong.css";

const HoatDongDangKy = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRegistrations = useMemo(() => {
    return MOCK_DANG_KY_HOAT_DONG.filter((reg) => {
      const matchesSearch =
        reg.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.idDV.includes(searchTerm) ||
        reg.tenHD.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm]);

  return (
    <div className="hd-container">
      <div className="hd-header">
        <h1 className="hd-title">Danh sách Đăng ký</h1>
        <div className="hd-actions">
          <button
            className="hd-update-btn"
            style={{ borderColor: "#004f9f", color: "#004f9f" }}
          >
            <BarChart size={18} />
            Thống kê đăng ký
          </button>
        </div>
      </div>

      <div className="hd-stats">
        <div className="hd-stat-item">
          <span className="hd-stat-item__label">Tổng đơn đăng ký</span>
          <span className="hd-stat-item__value">
            {MOCK_DANG_KY_HOAT_DONG.length}
          </span>
        </div>
        <div
          className="hd-stat-item"
          style={{ borderLeft: "3px solid #15803d" }}
        >
          <span className="hd-stat-item__label">Đã duyệt</span>
          <span className="hd-stat-item__value">
            {
              MOCK_DANG_KY_HOAT_DONG.filter(
                (r) => r.trangThaiDuyet === "Đã duyệt",
              ).length
            }
          </span>
        </div>
        <div
          className="hd-stat-item"
          style={{ borderLeft: "3px solid #b45309" }}
        >
          <span className="hd-stat-item__label">Chờ duyệt</span>
          <span className="hd-stat-item__value">
            {
              MOCK_DANG_KY_HOAT_DONG.filter(
                (r) => r.trangThaiDuyet === "Chờ duyệt",
              ).length
            }
          </span>
        </div>
        <div
          className="hd-stat-item"
          style={{ borderLeft: "3px solid #004f9f" }}
        >
          <span className="hd-stat-item__label">Tổng SV tham gia</span>
          <span className="hd-stat-item__value">685</span>
        </div>
      </div>

      <div className="hd-toolbar">
        <div className="hd-search-wrap">
          <Search size={18} />
          <input
            type="text"
            className="hd-search-input"
            placeholder="Tìm theo tên đoàn viên, MSSV, hoạt động..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="hd-update-btn">
          <Filter size={18} />
          Bộ lọc nâng cao
        </button>
      </div>

      <div className="hd-card">
        <table className="hd-table">
          <thead>
            <tr>
              <th>MSSV</th>
              <th>Họ và Tên</th>
              <th>Hoạt động đăng ký</th>
              <th>Ngày đăng ký</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.map((reg, idx) => (
              <tr key={`${reg.idDV}-${reg.idHD}-${idx}`}>
                <td style={{ fontWeight: 600, color: "#004f9f" }}>
                  {reg.idDV}
                </td>
                <td>{reg.hoTen}</td>
                <td style={{ fontWeight: 600 }}>{reg.tenHD}</td>
                <td>{new Date(reg.ngayDangKi).toLocaleDateString("vi-VN")}</td>
                <td>
                  <span
                    className={`hd-badge ${
                      reg.trangThaiDuyet?.trim() === "Đã duyệt"
                        ? "hd-badge--approved"
                        : reg.trangThaiDuyet?.trim() === "Chờ duyệt"
                          ? "hd-badge--pending"
                          : "hd-badge--rejected"
                    }`}
                  >
                    {reg.trangThaiDuyet?.trim()}
                  </span>
                </td>
                <td>
                  <button className="hd-update-btn" title="Xem chi tiết">
                    <UserCheck size={16} /> Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoatDongDangKy;
