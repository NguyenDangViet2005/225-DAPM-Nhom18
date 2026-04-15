import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "@/utils/dateFormat";

const HoatDongDuyetTable = ({
  loading,
  filteredSelections,
  processingId,
  onApprove,
  onReject,
}) => {
  return (
    <table className="hd-table">
      <thead>
        <tr>
          <th>MSSV</th>
          <th>Họ và Tên</th>
          <th>Chi đoàn</th>
          <th>Hoạt động (Cấp trường)</th>
          <th>Ngày đăng ký</th>
          <th>Trạng thái</th>
          <th>Thao tác duyệt</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td
              colSpan="7"
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#94a3b8",
              }}
            >
              Đang tải...
            </td>
          </tr>
        ) : (
          filteredSelections.map((reg, idx) => {
            const key = `${reg.maSV}-${reg.idHD}`;
            const isProcessing = processingId === key;
            const isPending = reg.trangThaiDuyet?.trim() === "Chờ duyệt";
            return (
              <tr key={`${key}-${idx}`}>
                <td style={{ fontWeight: 600, color: "#004f9f" }}>
                  {reg.maSV}
                </td>
                <td>{reg.hoTen}</td>
                <td style={{ fontSize: "0.82rem", color: "#64748b" }}>
                  {reg.tenChiDoan || "—"}
                </td>
                <td style={{ fontWeight: 600, color: "#0d1f3c" }}>
                  {reg.tenHD}
                </td>
                <td>{formatDate(reg.ngayDangKi)}</td>
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
                  {isPending ? (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="hd-update-btn"
                        style={{ color: "#15803d" }}
                        disabled={isProcessing}
                        onClick={() => onApprove(reg.maSV, reg.idHD, "Đã duyệt")}
                      >
                        <CheckCircle size={18} /> Duyệt
                      </button>
                      <button
                        className="hd-update-btn"
                        style={{ color: "#b91c1c" }}
                        disabled={isProcessing}
                        onClick={() =>
                          onReject({
                            maSV: reg.maSV,
                            idHD: reg.idHD,
                            hoTen: reg.hoTen,
                          })
                        }
                      >
                        <XCircle size={18} /> Từ chối
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                      Đã xử lý
                    </span>
                  )}
                </td>
              </tr>
            );
          })
        )}
        {!loading && filteredSelections.length === 0 && (
          <tr>
            <td
              colSpan="7"
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "#94a3b8",
              }}
            >
              Không có đơn đăng ký nào phù hợp
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default HoatDongDuyetTable;
