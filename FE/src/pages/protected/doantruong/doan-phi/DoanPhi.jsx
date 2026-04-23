import { useState, useEffect } from "react";
import { Download, TrendingUp } from "lucide-react";
import useDoanPhi from "@/hooks/useDoanPhi";
import UpdateFeeModal from "@/pages/protected/doantruong/doan-phi/UpdateMucDoanPhiModal";
import DataTableToolbar from "@/components/commons/DataTableToolbar/DataTableToolbar";
import Pagination from "@/components/commons/Pagination/Pagination";
import DoanPhiStatsCards from "@/pages/protected/doantruong/doan-phi/DoanPhiStatsCards";
import DoanPhiPaymentTable from "@/pages/protected/doantruong/doan-phi/DoanPhiPaymentTable";
import DoanPhiReceiptTable from "@/pages/protected/doantruong/doan-phi/DoanPhiReceiptTable";
import DoanPhiRatesTable from "@/pages/protected/doantruong/doan-phi/DoanPhiRatesTable";
import "./DoanPhi.css";

const fmtMoney = (n) => (n ? `${Number(n).toLocaleString()} ₫` : "—");
const PAGE_SIZE = 10;

const DoanPhi = () => {
  const {
    mucDoanPhi,
    doanPhiList,
    phieuThuList,
    chiDoanList,
    stats,
    pagination,
    loading,
    fetchMucDoanPhi,
    createMucDoanPhi,
    fetchChiDoan,
    fetchDoanPhi,
    fetchPhieuThu,
    duyetPhieuThu,
  } = useDoanPhi();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [chiDoanFilter, setChiDoanFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("payments");
  const [showUpdateFee, setShowUpdateFee] = useState(false);
  const [newFee, setNewFee] = useState({ namHoc: "", soTien: "" });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchMucDoanPhi();
    fetchChiDoan();
  }, [fetchMucDoanPhi, fetchChiDoan]);

  useEffect(() => {
    if (activeTab === "payments") {
      fetchDoanPhi({
        search: searchTerm,
        trangThai: statusFilter,
        idChiDoan: chiDoanFilter,
        page: currentPage,
        limit: PAGE_SIZE,
      });
    } else {
      fetchPhieuThu({ trangThai: statusFilter });
    }
  }, [
    activeTab,
    searchTerm,
    statusFilter,
    chiDoanFilter,
    currentPage,
    fetchDoanPhi,
    fetchPhieuThu,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, chiDoanFilter, activeTab]);

  const currentRate =
    mucDoanPhi.find((r) => r.trangThai === "Đang áp dụng") ?? mucDoanPhi[0];

  const statCards = {
    tongPhaiThu: stats?.tongPhaiThu ?? 0,
    tongDaThu: stats?.tongDaThu ?? 0,
    choDuyet: phieuThuList.filter((r) => r.trangThai === "Chờ duyệt").length,
    tyLe: stats?.tyLe ?? 0,
  };

  const handleConfirmUpdate = async () => {
    const res = await createMucDoanPhi({
      namHoc: newFee.namHoc,
      soTien: Number(newFee.soTien),
    });
    if (res?.success) {
      alert(
        `Đã cập nhật mức phí mới: ${Number(newFee.soTien).toLocaleString()} ₫`,
      );
      setShowUpdateFee(false);
      setNewFee({ namHoc: "", soTien: "" });
    }
  };

  const handleDuyet = async (idPhieuThu, trangThai) => {
    const label = trangThai === "Đã duyệt" ? "duyệt" : "từ chối";
    if (!window.confirm(`Xác nhận ${label} phiếu thu này?`)) return;
    await duyetPhieuThu(idPhieuThu, trangThai);
  };

  const paymentFilterOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "Đã đóng", label: "Đã đóng" },
    { value: "Chưa đóng", label: "Chưa đóng" },
    { value: "Đang chờ duyệt", label: "Đang chờ duyệt" },
  ];

  const receiptFilterOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "Chờ duyệt", label: "Chờ duyệt" },
    { value: "Đã duyệt", label: "Đã duyệt" },
    { value: "Từ chối", label: "Từ chối" },
  ];

  return (
    <div className="doan-phi-container">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="dp-header">
        <h1 className="dp-title">QUẢN LÝ ĐOÀN PHÍ</h1>
        <div className="dp-actions">
          <button
            className="dp-update-btn"
            style={{ borderColor: "#004f9f", color: "#004f9f" }}
          >
            <Download size={18} /> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* ── Current Fee Bar ────────────────────────────── */}
      <div className="dp-current-fee-bar">
        <div className="dp-current-fee-info">
          <span className="dp-current-fee-label">
            Mức đoàn phí đang áp dụng
          </span>
          <div className="dp-current-fee-value">
            {currentRate ? fmtMoney(currentRate.soTien) : "—"}
            <span className="dp-current-fee-sub">
              / năm học {currentRate?.namHoc ?? ""}
            </span>
          </div>
        </div>
        <button
          className="dp-update-btn"
          onClick={() => setShowUpdateFee(true)}
        >
          <TrendingUp size={18} /> Cập nhật mức thu mới
        </button>
      </div>

      {/* ── Stats ──────────────────────────────────────── */}
      <DoanPhiStatsCards stats={statCards} />

      {/* ── Toolbar ────────────────────────────────────── */}
      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm kiếm đoàn viên, mã SV..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={
          activeTab === "payments" ? paymentFilterOptions : receiptFilterOptions
        }
      >
        {activeTab === "payments" && (
          <select
            value={chiDoanFilter}
            onChange={(e) => setChiDoanFilter(e.target.value)}
            style={{
              padding: "0.65rem 1rem",
              border: "1.5px solid #e2e8f0",
              fontSize: "0.875rem",
              background: "#fff",
              minWidth: 180,
            }}
          >
            <option value="all">Tất cả chi đoàn</option>
            {chiDoanList.map((cd) => (
              <option key={cd.idChiDoan} value={cd.idChiDoan}>
                {cd.tenChiDoan}
              </option>
            ))}
          </select>
        )}
      </DataTableToolbar>

      {/* ── Tabs ───────────────────────────────────────── */}
      <div className="dp-tabs">
        <div style={{ display: "flex", borderBottom: "1px solid #eef2f6" }}>
          {[
            { key: "payments", label: "Danh sách Đoàn viên" },
            { key: "receipts", label: `Phiếu thu` },
            { key: "rates", label: "Lịch sử mức phí" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setActiveTab(t.key);
                setStatusFilter("all");
                setSearchTerm("");
                setCurrentPage(1);
              }}
              style={{
                padding: "1rem 1.5rem",
                background: "none",
                border: "none",
                borderBottom:
                  activeTab === t.key
                    ? "3px solid #004f9f"
                    : "3px solid transparent",
                fontWeight: 700,
                color: activeTab === t.key ? "#004f9f" : "#64748b",
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────── */}
      <div className="dp-card">
        {loading && (
          <div
            style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}
          >
            Đang tải...
          </div>
        )}

        {/* Tab: Danh sách đoàn viên */}
        {!loading && activeTab === "payments" && (
          <>
            <DoanPhiPaymentTable doanPhiList={doanPhiList} />
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              onPageChange={setCurrentPage}
              loading={loading}
              itemLabel="đoàn viên"
            />
          </>
        )}

        {/* Tab: Phiếu thu */}
        {!loading && activeTab === "receipts" && (
          <DoanPhiReceiptTable
            phieuThuList={phieuThuList}
            onDuyet={handleDuyet}
          />
        )}

        {/* Tab: Lịch sử mức phí */}
        {!loading && activeTab === "rates" && (
          <DoanPhiRatesTable mucDoanPhi={mucDoanPhi} />
        )}
      </div>

      {/* ── Modal cập nhật mức phí ─────────────────────── */}
      <UpdateFeeModal
        show={showUpdateFee}
        onClose={() => setShowUpdateFee(false)}
        onConfirm={handleConfirmUpdate}
        feeValue={newFee.soTien}
        setFeeValue={(v) => setNewFee((prev) => ({ ...prev, soTien: v }))}
        namHoc={newFee.namHoc}
        setNamHoc={(v) => setNewFee((prev) => ({ ...prev, namHoc: v }))}
      />
    </div>
  );
};

export default DoanPhi;
