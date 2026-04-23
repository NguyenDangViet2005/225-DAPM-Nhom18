import { formatDate } from "@/utils";
import { CheckCircle, XCircle, Eye } from "lucide-react";

const YeuCauTable = ({
  requests,
  loading,
  onOpenDetail,
  onApprove,
  onReject,
}) => {
  return (
    <div className="yc-card">
      <table className="yc-table">
        <thead>
          <tr>
            <th>Thông tin hoạt động</th>
            <th>Đơn vị đề xuất</th>
            <th>Thời gian</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                Đang tải dữ liệu...
              </td>
            </tr>
          )}
          {!loading && requests.length === 0 && (
            <tr>
              <td
                colSpan="5"
                style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}
              >
                Không có yêu cầu nào
              </td>
            </tr>
          )}
          {!loading &&
            requests.map((req, i) => (
              <tr key={i}>
                <td>
                  <p style={{ margin: "0 0 2px 0" }}>
                    <strong>{req.tenHD}</strong>
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                    }}
                  >
                    {req.moTa || "Không có mô tả"}
                  </p>
                </td>
                <td>{req.donViToChuc || "Không xác định"}</td>
                <td style={{ fontSize: "0.85rem" }}>
                  {formatDate(req.ngayToChuc)} <br />
                </td>
                <td>
                  <span
                    className={`yc-badge ${
                      req.trangThaiHD === "Đã duyệt"
                        ? "yc-badge--approved"
                        : req.trangThaiHD === "Từ chối"
                          ? "yc-badge--rejected"
                          : "yc-badge--pending"
                    }`}
                  >
                    {req.trangThaiHD}
                  </span>
                </td>
                <td>
                  {req.trangThaiHD === "Chưa duyệt" && (
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={() => onApprove(req)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          border: "none",
                          background: "#f0fdf4",
                          color: "#15803d",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                        }}
                      >
                        <CheckCircle size={14} /> Duyệt
                      </button>
                      <button
                        onClick={() => onReject(req)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          border: "none",
                          background: "#fef2f2",
                          color: "#dc2626",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                        }}
                      >
                        <XCircle size={14} /> Từ chối
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => onOpenDetail(req)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "1px solid #cbd5e1",
                      background: "#fff",
                      color: "#004f9f",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      marginTop: "4px",
                    }}
                  >
                    <Eye size={14} /> Chi tiết
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default YeuCauTable;
