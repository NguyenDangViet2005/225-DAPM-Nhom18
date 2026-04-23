import { useState } from "react";
import { X, Search } from "lucide-react";
import { doanvienAPI } from "@/apis/doanvien.api";
import { formatDate } from "@/utils";

const SoDoanCreateModal = ({ isOpen, onClose, onCreate }) => {
  const [idDV, setIdDV] = useState("");
  const [student, setStudent] = useState(null);
  const [searching, setSearching] = useState(false);
  const [ngayCap, setNgayCap] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [noiCap, setNoiCap] = useState("Đoàn trường cấp");

  const handleSearch = async () => {
    if (!idDV.trim()) return;
    setSearching(true);
    setStudent(null);
    try {
      const res = await doanvienAPI.getById(idDV.trim());
      if (res && res.data && res.data.success) {
        setStudent(res.data.data);
      } else {
        alert("Không tìm thấy đoàn viên với mã này.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi tìm kiếm đoàn viên!");
    } finally {
      setSearching(false);
    }
  };

  const handleCreate = async () => {
    if (!student) return;
    await onCreate({ idDV: student.idDV, ngayCap, noiCap });
    setIdDV("");
    setStudent(null);
  };

  if (!isOpen) return null;

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
          width: "500px",
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
              fontSize: "1.2rem",
              fontWeight: 700,
              margin: 0,
              color: "#0f172a",
            }}
          >
            Tiếp nhận sổ đoàn viên (Lẻ)
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

        <div className="modal-body" style={{ padding: "10px 0" }}>
          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                color: "#475569",
              }}
            >
              Mã sinh viên (Đoàn viên)
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={idDV}
                onChange={(e) => setIdDV(e.target.value)}
                placeholder="Nhập mã sinh viên..."
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  outline: "none",
                  fontSize: "0.95rem",
                }}
              />
              <button
                onClick={handleSearch}
                disabled={searching}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 16px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#004f9f",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                <Search size={18} /> {searching ? "Tìm..." : "Tìm"}
              </button>
            </div>
          </div>

          {student && (
            <div
              style={{
                padding: "15px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <p style={{ margin: "0 0 5px 0", color: "#0f172a" }}>
                <strong>Họ tên:</strong> {student.hoTen}
              </p>
              <p style={{ margin: "0 0 5px 0", color: "#0f172a" }}>
                <strong>Chi đoàn:</strong> {student.tenChiDoan || "Chưa có"}
              </p>
              <p style={{ margin: "0", color: "#0f172a" }}>
                <strong>Ngày sinh:</strong>{" "}
                {formatDate(student.ngaySinh)}
              </p>
            </div>
          )}

          {student && (
            <>
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 600,
                    color: "#475569",
                  }}
                >
                  Ngày cấp sổ
                </label>
                <input
                  type="date"
                  value={ngayCap}
                  onChange={(e) => setNgayCap(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    outline: "none",
                    fontSize: "0.95rem",
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 600,
                    color: "#475569",
                  }}
                >
                  Nơi cấp
                </label>
                <input
                  type="text"
                  value={noiCap}
                  onChange={(e) => setNoiCap(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    outline: "none",
                    fontSize: "0.95rem",
                  }}
                />
              </div>
            </>
          )}

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
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
              onClick={handleCreate}
              disabled={!student}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                background: "#004f9f",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600,
                opacity: !student ? 0.5 : 1,
              }}
            >
              Tiếp nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoDoanCreateModal;
