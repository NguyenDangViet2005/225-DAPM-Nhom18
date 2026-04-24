import { useState, useMemo, useEffect } from "react";
import { CheckCircle, Search, CalendarCheck } from "lucide-react";
import { hoatdongAPI } from "@/apis/hoatdong.api";
import { formatDate, getErrorMessage } from "@/utils";
import { TRANG_THAI_DUYET } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import "./HoatDongChiDoan.css";

const HoatDongChiDoanXacNhan = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await hoatdongAPI.getAllChidoanActivities({ limit: 100 });
      if (res.success) {
        const myActivities = (res.data || []).filter(a => a.idChiDoan === user?.idChiDoan);
        setActivities(myActivities);
      }
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Chỉ lấy những hoạt động "Đã duyệt" (tức là đang diễn ra, chưa kết thúc)
  const pendingActivities = useMemo(
    () =>
      activities.filter(
        (hd) =>
          hd.trangThaiHD === TRANG_THAI_DUYET.DA_DUYET &&
          (hd.tenHD.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hd.idHD.includes(searchTerm))
      ),
    [activities, searchTerm]
  );

  const completedCount = activities.filter((hd) => hd.trangThaiHD === TRANG_THAI_DUYET.DA_KET_THUC).length;

  const handleConfirmActivity = async (idHD) => {
    const isConfirm = window.confirm(
      "Bạn có chắc chắn xác nhận hoàn thành hoạt động này?\nHệ thống sẽ đóng hoạt động và tự động cộng điểm cho tất cả đoàn viên đã được duyệt tham gia."
    );
    if (!isConfirm) return;

    try {
      const res = await hoatdongAPI.xacNhanHoanThanh(idHD);
      if (res.success) {
        alert(res.message || "Đã xác nhận hoàn thành hoạt động!");
        fetchActivities();
      } else {
        alert(res.message || "Xác nhận thất bại!");
      }
    } catch (error) {
      alert(getErrorMessage(error));
    }
  };

  return (
    <div className="hcd-page">
      {/* Header */}
      <div className="hcd-header">
        <div>
          <h1 className="hcd-title">Xác nhận hoàn thành hoạt động</h1>
          <p className="hcd-subtitle">
            Quản lý và xác nhận kết thúc các hoạt động của Chi đoàn để cộng điểm rèn luyện
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="hcd-stats" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {[
          {
            icon: <CalendarCheck size={20} />,
            label: "Hoạt động chờ kết thúc",
            value: pendingActivities.length,
            color: "#d97706",
          },
          {
            icon: <CheckCircle size={20} />,
            label: "Hoạt động đã kết thúc",
            value: completedCount,
            color: "#16a34a",
          },
          {
            icon: <CalendarCheck size={20} />,
            label: "Tổng số hoạt động",
            value: activities.length,
            color: "#004f9f",
          },
        ].map((s, i) => (
          <div key={i} className="hcd-stat-card">
            <div
              className="hcd-stat-card__icon"
              style={{ background: `${s.color}15`, color: s.color }}
            >
              {s.icon}
            </div>
            <div>
              <p className="hcd-stat-card__label">{s.label}</p>
              <p className="hcd-stat-card__value">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="hcd-card">
        {/* Toolbar */}
        <div className="hcd-toolbar">
          <div className="hcd-search-wrap">
            <Search size={15} className="hcd-search-icon" />
            <input
              className="hcd-search-input"
              placeholder="Tìm mã hoặc tên hoạt động..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="hcd-table-wrap">
          <table className="hcd-table">
            <thead>
              <tr>
                <th>Mã HĐ</th>
                <th>Tên hoạt động</th>
                <th>Ngày tổ chức</th>
                <th>Điểm cộng</th>
                <th>Số người tham gia</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pendingActivities.map((hd, idx) => (
                <tr
                  key={hd.idHD}
                  className={idx % 2 === 1 ? "hcd-tr--alt" : ""}
                >
                  <td className="hcd-td-mssv">{hd.idHD}</td>
                  <td className="hcd-td-name" style={{ maxWidth: '300px' }}>{hd.tenHD}</td>
                  <td className="hcd-td-muted">{formatDate(hd.ngayToChuc)}</td>
                  <td style={{ fontWeight: 600, color: '#16a34a' }}>+{hd.diemHD}</td>
                  <td>
                    <span className="hcd-badge" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                      <Users size={11} style={{ marginRight: 4 }} />
                      {hd.soLuongDaDK} / {hd.soLuongMax}
                    </span>
                  </td>
                  <td>
                    <span className="hcd-badge hcd-badge--pending">
                      Đang diễn ra
                    </span>
                  </td>
                  <td>
                    <button
                      className="hcd-btn hcd-btn--success hcd-btn--sm"
                      onClick={() => handleConfirmActivity(hd.idHD)}
                    >
                      <CheckCircle size={13} /> Kết thúc
                    </button>
                  </td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan="7" className="hcd-empty">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              )}
              {!loading && pendingActivities.length === 0 && (
                <tr>
                  <td colSpan="7" className="hcd-empty">
                    Không có hoạt động nào đang chờ xác nhận hoàn thành
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Component con tạm thời bị thiếu từ react-lucide
const Users = ({ size, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

export default HoatDongChiDoanXacNhan;
