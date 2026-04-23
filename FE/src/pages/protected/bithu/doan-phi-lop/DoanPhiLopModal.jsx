import { Send, Upload } from "lucide-react";
import { formatMoney } from "@/utils";

const DoanPhiLopModal = ({
  selectedCount,
  moneyToSubmit,
  namHoc,
  uploadedFile,
  setUploadedFile,
  handleSubmit,
  handleTabChange,
}) => {
  return (
    <div className="dpl-card dpl-gui">
      <div className="dpl-gui__header">
        <div className="dpl-gui__icon">
          <Send size={22} />
        </div>
        <div>
          <h3 className="dpl-gui__title">Gửi phiếu thu đoàn phí</h3>
          <p className="dpl-gui__sub">
            Xác nhận những đoàn viên vừa chọn để lập thành phiếu nộp lên Đoàn trường
          </p>
        </div>
      </div>

      <div className="dpl-gui__summary">
        {[
          ["Số đoàn viên được chọn nộp", `${selectedCount} người`],
          ["Tổng tiền trên phiếu thu", formatMoney(moneyToSubmit)],
          ["Năm học", namHoc],
        ].map(([k, v]) => (
          <div key={k} className="dpl-gui__summary-row">
            <span>{k}</span>
            <strong>{v}</strong>
          </div>
        ))}
      </div>

      {/* File Upload */}
      <div style={{ padding: "0 24px 24px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#0f172a",
          }}
        >
          Đính kèm file chứng từ <span style={{ color: "#dc2626" }}>*</span>
        </label>
        <div
          style={{
            border: "2px dashed #cbd5e1",
            borderRadius: "8px",
            padding: "24px",
            textAlign: "center",
            backgroundColor: "#f8fafc",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.style.borderColor = "#004f9f";
            e.currentTarget.style.backgroundColor = "#eff6ff";
          }}
          onDragLeave={(e) => {
            e.currentTarget.style.borderColor = "#cbd5e1";
            e.currentTarget.style.backgroundColor = "#f8fafc";
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.style.borderColor = "#cbd5e1";
            e.currentTarget.style.backgroundColor = "#f8fafc";
            const file = e.dataTransfer.files[0];
            if (file) setUploadedFile(file);
          }}
          onClick={() => document.getElementById("file-upload").click()}
        >
          <Upload size={32} style={{ color: "#64748b", marginBottom: "12px" }} />
          <input
            id="file-upload"
            type="file"
            accept="image/*,.pdf"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) setUploadedFile(file);
            }}
          />
          {uploadedFile ? (
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#004f9f", marginBottom: "4px" }}>
                {uploadedFile.name}
              </p>
              <p style={{ fontSize: "13px", color: "#64748b" }}>
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadedFile(null);
                }}
                style={{
                  marginTop: "8px",
                  padding: "4px 12px",
                  fontSize: "13px",
                  color: "#dc2626",
                  background: "none",
                  border: "1px solid #dc2626",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Xóa file
              </button>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#475569", marginBottom: "4px" }}>
                Kéo thả file vào đây hoặc click để chọn
              </p>
              <p style={{ fontSize: "13px", color: "#94a3b8" }}>
                Hỗ trợ: JPG, PNG, PDF (tối đa 10MB)
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="dpl-gui__actions">
        <button className="dpl-btn dpl-btn--outline" onClick={() => handleTabChange("danh-sach")}>
          Quay lại danh sách
        </button>
        <button
          className="dpl-btn dpl-btn--primary"
          onClick={handleSubmit}
          disabled={selectedCount === 0 || !uploadedFile}
        >
          <Send size={15} /> Xác nhận gửi phiếu
        </button>
      </div>
    </div>
  );
};

export default DoanPhiLopModal;
