import React from "react";
import { X } from "lucide-react";

const RejectRegistrationModal = ({
  rejectTarget,
  lyDoTuChoi,
  setLyDoTuChoi,
  onClose,
  onConfirm,
}) => {
  if (!rejectTarget) return null;

  return (
    <div className="dp-modal-overlay">
      <div className="dp-modal" style={{ width: "480px", maxWidth: "95%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 className="dp-modal-title">Từ chối đăng ký</h2>
          <button className="dp-update-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <p style={{ margin: "0.75rem 0", color: "#475569" }}>
          Từ chối đăng ký của <strong>{rejectTarget.hoTen}</strong>
        </p>
        <textarea
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            fontSize: "0.9rem",
            resize: "vertical",
            boxSizing: "border-box",
          }}
          placeholder="Nhập lý do từ chối (không bắt buộc)..."
          value={lyDoTuChoi}
          onChange={(e) => setLyDoTuChoi(e.target.value)}
        />
        <div className="dp-modal-actions">
          <button className="dp-btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button
            className="dp-btn-save"
            style={{ background: "#b91c1c", borderColor: "#b91c1c" }}
            onClick={onConfirm}
          >
            Xác nhận từ chối
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectRegistrationModal;
