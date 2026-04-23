import { ShieldCheck, Building, Circle, Edit, Key, UserX } from "lucide-react";
import { formatDate } from "@/utils";

const TaiKhoanTable = ({ accounts, onEdit, onReset, onToggleStatus }) => {
  return (
    <table className="tk-table">
      <thead>
        <tr>
          <th>Tên đăng nhập</th>
          <th>Vai trò</th>
          <th>Liên kết</th>
          <th>Ngày tạo</th>
          <th>Trạng thái</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {accounts.map((tk) => (
          <tr key={tk.idUser}>
            <td>
              <div className="tk-user-info">
                <div className="tk-avatar">
                  {tk.tenNguoiDung.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="tk-user-name">{tk.tenNguoiDung}</span>
                  <span className="tk-user-id">#{tk.idUser}</span>
                </div>
              </div>
            </td>
            <td>
              <div
                className="tk-activity-info"
                style={{ fontWeight: 600, color: "#004f9f" }}
              >
                <ShieldCheck size={14} /> {tk.vaiTro?.tenVaiTro || "—"}
              </div>
            </td>
            <td>
              {tk.doanVien && (
                <div className="tk-activity-info">
                  <Building size={14} /> {tk.doanVien.hoTen}
                </div>
              )}
              {tk.khoaTK && (
                <div className="tk-activity-info">
                  <Building size={14} /> {tk.khoaTK.tenKhoa}
                </div>
              )}
              {!tk.doanVien && !tk.khoaTK && (
                <span style={{ color: "#94a3b8" }}>—</span>
              )}
            </td>
            <td>
              <div className="tk-activity-info">
                {formatDate(tk.ngayTao)}
              </div>
            </td>
            <td>
              <span
                className={`tk-badge ${tk.trangThai ? "tk-badge--active" : "tk-badge--locked"}`}
              >
                <Circle size={8} fill="currentColor" />
                {tk.trangThai ? "Đang hoạt động" : "Đã khóa"}
              </span>
            </td>
            <td>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="tk-btn-icon"
                  title="Cập nhật"
                  id={`btn-sua-${tk.idUser}`}
                  onClick={() => onEdit(tk)}
                >
                  <Edit size={16} />
                </button>
                <button
                  className="tk-btn-icon"
                  title="Đặt lại mật khẩu"
                  id={`btn-reset-${tk.idUser}`}
                  onClick={() => onReset(tk)}
                >
                  <Key size={16} />
                </button>
                <button
                  className={`tk-btn-icon ${tk.trangThai ? "tk-btn-lock" : "tk-btn-active"}`}
                  title={tk.trangThai ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                  id={`btn-toggle-${tk.idUser}`}
                  onClick={() => onToggleStatus(tk)}
                >
                  {tk.trangThai ? <UserX size={16} /> : <ShieldCheck size={16} />}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaiKhoanTable;
