import { X } from "lucide-react";

const SoDoanStatusModal = ({
  isOpen,
  onClose,
  selectedSoDoan,
  newStatus,
  setNewStatus,
  onUpdate,
  updating,
}) => {
  if (!isOpen || !selectedSoDoan) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        style={{
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "12px",
          width: "400px",
          maxWidth: "90%",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              margin: 0,
              color: "#0f172a",
            }}
          >
            Cập nhật trạng thái
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <p
            style={{
              margin: "0 0 8px 0",
              fontSize: "0.9rem",
              color: "#475569",
            }}
          >
            Sổ đoàn của <strong>{selectedSoDoan.doanVien?.hoTen}</strong>
          </p>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              outline: "none",
              fontSize: "0.95rem",
            }}
          >
            <option value="Đã nộp sổ">Đã nộp sổ</option>
            <option value="Chưa nộp sổ">Chưa nộp sổ</option>
            <option value="Đã rút sổ">Đã rút sổ</option>
          </select>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              background: "#fff",
              color: "#475569",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Hủy
          </button>
          <button
            onClick={onUpdate}
            disabled={updating}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              background: "#004f9f",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
              opacity: updating ? 0.7 : 1,
            }}
          >
            {updating ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SoDoanStatusModal;
