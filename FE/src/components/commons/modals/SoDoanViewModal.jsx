import { X } from "lucide-react";
import { formatDate } from "@/utils/dateFormat";

const SoDoanViewModal = ({ isOpen, onClose, viewSoDoan, loadingView }) => {
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
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "0.5rem",
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
            Chi tiết Sổ Đoàn
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {loadingView ? (
          <p
            style={{
              textAlign: "center",
              color: "#64748b",
              margin: "2rem 0",
            }}
          >
            Đang tải...
          </p>
        ) : viewSoDoan ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontSize: "0.95rem",
            }}
          >
            <div>
              <strong>Mã Sổ Đoàn:</strong> {viewSoDoan.idSoDoan}
            </div>
            <div>
              <strong>Tình trạng sổ:</strong>{" "}
              <span
                className={`status-badge ${viewSoDoan.trangThai === "Đã nộp sổ" ? "status-badge--holding" : viewSoDoan.trangThai === "Đã rút sổ" ? "status-badge--withdrawn" : "status-badge--lost"}`}
              >
                {viewSoDoan.trangThai}
              </span>
            </div>
            {viewSoDoan.ngayRutSo && (
              <div>
                <strong>Ngày rút sổ:</strong> {formatDate(viewSoDoan.ngayRutSo)}
              </div>
            )}
            <div>
              <strong>Ngày cấp:</strong>{" "}
              {viewSoDoan.ngayCap ? formatDate(viewSoDoan.ngayCap) : "Chưa cập nhật"}
            </div>
            <div>
              <strong>Nơi cấp:</strong> {viewSoDoan.noiCap || "Chưa cập nhật"}
            </div>
            <div
              style={{
                height: "1px",
                background: "#eef2f6",
                margin: "8px 0",
              }}
            ></div>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "#004f9f",
                margin: "5px 0",
              }}
            >
              Thông tin Đoàn Viên
            </h3>
            <div>
              <strong>MSSV:</strong> {viewSoDoan.idDV}
            </div>
            <div>
              <strong>Họ tên:</strong> {viewSoDoan.doanVien?.hoTen}
            </div>
            <div>
              <strong>Ngày sinh:</strong>{" "}
              {viewSoDoan.doanVien?.ngaySinh
                ? formatDate(viewSoDoan.doanVien?.ngaySinh)
                : "—"}
            </div>
            <div>
              <strong>Giới tính:</strong> {viewSoDoan.doanVien?.gioiTinh || "—"}
            </div>
            <div>
              <strong>Chức vụ:</strong> {viewSoDoan.doanVien?.chucVu || "Đoàn viên"}
            </div>
            <div>
              <strong>Chi đoàn:</strong> {viewSoDoan.doanVien?.chiDoan?.tenChiDoan} (
              {viewSoDoan.doanVien?.chiDoan?.khoa?.tenKhoa})
            </div>
            <div>
              <strong>Email:</strong> {viewSoDoan.doanVien?.email || "—"}
            </div>
            <div>
              <strong>Số điện thoại:</strong> {viewSoDoan.doanVien?.SDT || "—"}
            </div>
          </div>
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "#ef4444",
              margin: "2rem 0",
            }}
          >
            Không tải được thông tin sổ
          </p>
        )}
      </div>
    </div>
  );
};

export default SoDoanViewModal;
