import { XCircle } from "lucide-react";
import { formatDate } from "@/utils";

const YeuCauHistoryModal = ({ show, onClose, historyRequests }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "900px", width: "90%" }}
      >
        <div className="modal-header">
          <h2>Lịch sử phê duyệt</h2>
          <button className="modal-close" onClick={onClose}>
            <XCircle size={24} />
          </button>
        </div>
        <div
          className="modal-body"
          style={{ maxHeight: "600px", overflowY: "auto", padding: "20px" }}
        >
          {historyRequests.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#64748b" }}
            >
              Chưa có lịch sử phê duyệt nào.
            </div>
          ) : (
            <table className="yc-table">
              <thead>
                <tr>
                  <th>Tên HĐ</th>
                  <th>Đơn vị đề xuất</th>
                  <th>Ngày TC</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {historyRequests.map((yc) => (
                  <tr key={yc.idHD}>
                    <td>
                      <strong>{yc.tenHD}</strong>
                    </td>
                    <td>{yc.donViToChuc || "Không có tên ĐV"}</td>
                    <td>
                      {formatDate(yc.ngayToChuc)}
                    </td>
                    <td>
                      <span
                        className={`yc-badge ${yc.trangThaiHD === "Đã duyệt" ? "yc-badge--approved" : "yc-badge--rejected"}`}
                      >
                        {yc.trangThaiHD}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default YeuCauHistoryModal;
