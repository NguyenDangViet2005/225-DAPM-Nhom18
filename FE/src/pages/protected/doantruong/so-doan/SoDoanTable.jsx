import { Eye, FileText, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/dateFormat";

const SoDoanTable = ({
  loading,
  filteredData,
  handleViewDetails,
  setSelectedSoDoan,
  setNewStatus,
  setShowStatusModal,
}) => {
  return (
    <div className="so-doan-card">
      <table className="so-doan-table">
        <thead>
          <tr>
            <th>Mã Sổ</th>
            <th>Đoàn viên</th>
            <th>Khoa / Chi đoàn</th>
            <th>Ngày cấp</th>
            <th>Nơi cấp</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="so-doan-table-empty">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : filteredData.length === 0 ? (
            <tr>
              <td colSpan="7" className="so-doan-table-empty">
                Không tìm thấy sổ đoàn nào
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <tr key={item.idSoDoan}>
                <td className="member-id-highlight">
                  {item.idSoDoan}
                </td>
                <td>
                  <div className="member-info">
                    <span className="member-name">{item.doanVien?.hoTen}</span>
                    <span className="member-id">MSSV: {item.idDV}</span>
                  </div>
                </td>
                <td>
                  <div className="member-info">
                    <span className="member-name">
                      {item.doanVien?.chiDoan?.khoa?.tenKhoa}
                    </span>
                    <span className="member-id">
                      {item.doanVien?.chiDoan?.tenChiDoan}
                    </span>
                  </div>
                </td>
                <td>{item.ngayCap ? formatDate(item.ngayCap) : "—"}</td>
                <td className="so-doan-table-noi-cap">
                  {item.noiCap || "—"}
                </td>
                <td>
                  <span
                    className={`status-badge ${
                      item.trangThai === "Đã nộp sổ"
                        ? "status-badge--holding"
                        : item.trangThai === "Đã rút sổ"
                        ? "status-badge--withdrawn"
                        : "status-badge--lost"
                    }`}
                  >
                    {item.trangThai}
                  </span>
                  {item.trangThai === "Đã rút sổ" && item.ngayRutSo && (
                    <div className="so-doan-table-ngay-rut">
                      (Ngày rút: {formatDate(item.ngayRutSo)})
                    </div>
                  )}
                </td>
                <td>
                  <div className="action-btns">
                    <button
                      className="btn-icon"
                      title="Xem chi tiết sổ"
                      onClick={() => handleViewDetails(item.idSoDoan)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="btn-icon"
                      title="Cập nhật trạng thái"
                      onClick={() => {
                        setSelectedSoDoan(item);
                        setNewStatus(item.trangThai || "");
                        setShowStatusModal(true);
                      }}
                    >
                      <FileText size={16} />
                    </button>
                    <button className="btn-icon" title="Xóa sổ">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SoDoanTable;