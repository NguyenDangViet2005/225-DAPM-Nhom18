import { useState, useEffect, useCallback, useRef } from "react";
import { CheckCircle, Search } from "lucide-react";
import doanviendangkiAPI from "@/apis/doanviendangki.api";
import HoatDongDuyetTable from "@/components/commons/tables/HoatDongDuyetTable";
import RejectRegistrationModal from "@/components/commons/modals/RejectRegistrationModal";
import "./HoatDong.css";

const HoatDongDuyet = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Chờ duyệt"); // bộ lọc trạng thái

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // Modal từ chối
  const [rejectTarget, setRejectTarget] = useState(null);
  const [lyDoTuChoi, setLyDoTuChoi] = useState("");

  // Track if component has loaded to prevent duplicate fetches
  const isInitialMount = useRef(true);

  // Fetch danh sách đăng ký từ backend — tất cả trạng thái
  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const result = await doanviendangkiAPI.getAllRegistrationsDoantruong();
      if (result.success) {
        setRegistrations(
          result.data.map((reg) => ({
            ...reg,
            maSV: reg.maSV?.trim(),
            idDV: reg.idDV?.trim(),
            idHD: reg.idHD?.trim(),
            tenHD: reg.tenHD?.trim(),
            trangThaiDuyet: reg.trangThaiDuyet?.trim(),
          })),
        );
      }
    } catch (err) {
      console.error("Lỗi fetch đăng ký:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load dữ liệu khi component mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchRegistrations();
    }
  }, [fetchRegistrations]);

  // Duyệt / Từ chối
  const handleDuyet = async (maSV, idHD, trangThai, lyDo = null) => {
    const key = `${maSV}-${idHD}`;
    setProcessingId(key);
    try {
      const result = await doanviendangkiAPI.duyetDangKy(
        idHD,
        maSV,
        trangThai,
        lyDo,
      );
      if (result.success) {
        setRegistrations((prev) =>
          prev.map((r) =>
            r.maSV === maSV && r.idHD === idHD
              ? { ...r, trangThaiDuyet: trangThai }
              : r,
          ),
        );
      } else {
        alert(result.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      console.error("Lỗi duyệt đăng ký:", err);
      alert("Không thể kết nối server");
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectTarget) return;
    await handleDuyet(
      rejectTarget.maSV,
      rejectTarget.idHD,
      "Từ chối",
      lyDoTuChoi,
    );
    setRejectTarget(null);
    setLyDoTuChoi("");
  };

  // Stats
  const pendingRegs = registrations.filter(
    (r) => r.trangThaiDuyet?.trim() === "Chờ duyệt",
  );
  const approvedRegs = registrations.filter(
    (r) => r.trangThaiDuyet?.trim() === "Đã duyệt",
  );
  const rejectedRegs = registrations.filter(
    (r) => r.trangThaiDuyet?.trim() === "Từ chối",
  );

  // Lọc hiển thị
  const filtered = registrations.filter((reg) => {
    const matchSearch =
      (reg.hoTen || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reg.maSV || "").includes(searchTerm) ||
      (reg.tenHD || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      statusFilter === "all" || reg.trangThaiDuyet?.trim() === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="hd-container">
      {/* Header */}
      <div className="hd-header">
        <h1 className="hd-title">Duyệt đăng ký Đoàn trường</h1>
        <div className="hd-actions">
          <button
            className="hd-update-btn"
            style={{
              backgroundColor: "#15803d",
              borderColor: "#15803d",
              color: "#fff",
            }}
            disabled={pendingRegs.length === 0}
            onClick={async () => {
              for (const reg of pendingRegs)
                await handleDuyet(reg.maSV, reg.idHD, "Đã duyệt");
            }}
          >
            <CheckCircle size={18} />
            Duyệt hàng loạt ({pendingRegs.length})
          </button>
        </div>
      </div>

      {/* Stats — lấy từ DB */}
      <div className="hd-stats">
        <div
          className="hd-stat-item"
          style={{ borderLeft: "3px solid #b45309", cursor: "pointer" }}
          onClick={() => setStatusFilter("Chờ duyệt")}
        >
          <span className="hd-stat-item__label">Chờ xử lý (Cấp trường)</span>
          <span className="hd-stat-item__value" style={{ color: "#b45309" }}>
            {pendingRegs.length} đơn
          </span>
        </div>
        <div
          className="hd-stat-item"
          style={{ borderLeft: "3px solid #15803d", cursor: "pointer" }}
          onClick={() => setStatusFilter("Đã duyệt")}
        >
          <span className="hd-stat-item__label">Đã duyệt</span>
          <span className="hd-stat-item__value" style={{ color: "#15803d" }}>
            {approvedRegs.length} đơn
          </span>
        </div>
        <div
          className="hd-stat-item"
          style={{ borderLeft: "3px solid #dc2626", cursor: "pointer" }}
          onClick={() => setStatusFilter("Từ chối")}
        >
          <span className="hd-stat-item__label">Từ chối</span>
          <span className="hd-stat-item__value" style={{ color: "#dc2626" }}>
            {rejectedRegs.length} đơn
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="hd-toolbar" style={{ marginBottom: '1rem' }}>
        <div className="hd-search-wrap" style={{ flex: 1 }}>
          <Search size={18} />
          <input
            type="text"
            className="hd-search-input"
            placeholder="Tìm tên đoàn viên, MSSV hoặc tên hoạt động (Trường)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="hd-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="Chờ duyệt">Chờ duyệt</option>
          <option value="Đã duyệt">Đã duyệt</option>
          <option value="Từ chối">Từ chối</option>
        </select>
      </div>

      {/* Table */}
      <div className="hd-card">
        <HoatDongDuyetTable
          loading={loading}
          filteredSelections={filtered}
          processingId={processingId}
          onApprove={handleDuyet}
          onReject={setRejectTarget}
        />
      </div>

      {/* Modal từ chối */}
      <RejectRegistrationModal
        rejectTarget={rejectTarget}
        lyDoTuChoi={lyDoTuChoi}
        setLyDoTuChoi={setLyDoTuChoi}
        onClose={() => {
          setRejectTarget(null);
          setLyDoTuChoi("");
        }}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
};

export default HoatDongDuyet;
