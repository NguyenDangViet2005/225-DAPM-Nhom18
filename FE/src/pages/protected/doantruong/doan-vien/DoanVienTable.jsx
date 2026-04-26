import { Edit, RefreshCw, Eye } from "lucide-react";
import Pagination from "@/components/commons/Pagination/Pagination";
import { formatDate } from "@/utils";

const DoanVienTable = ({ 
  data, 
  loading, 
  pagination, 
  onEdit,
  onViewDetail,
  onPageChange 
}) => {
  return (
    <div className="ql-dv-card">
      <table className="ql-dv-table">
        <thead>
          <tr>
            <th>Mã sinh viên</th>
            <th>Họ và tên</th>
            <th>Chi đoàn</th>
            <th>Giới tính</th>
            <th>Ngày sinh</th>
            <th>Liên hệ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="ql-dv-loading">
                <RefreshCw size={32} className="ql-dv-spin" />
                <span>Đang tải dữ liệu...</span>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={7} className="ql-dv-empty">
                Không tìm thấy đoàn viên nào
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.idDV}>
                <td>
                  <strong style={{ color: "#004f9f" }}>{item.idDV}</strong>
                </td>
                <td>
                  <span className="ql-dv-user-name">{item.hoTen}</span>
                </td>
                <td>
                  {item.chiDoan ? (
                    <div>
                      <div className="ql-dv-user-name" style={{ fontSize: "0.875rem" }}>
                        {item.chiDoan.tenChiDoan}
                      </div>
                      {item.chiDoan.khoa && (
                        <span className="ql-dv-user-email">
                          {item.chiDoan.khoa.tenKhoa}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span style={{ color: "#94a3b8", fontStyle: "italic" }}>
                      Chưa có
                    </span>
                  )}
                </td>
                <td>
                  <span className={`ql-dv-badge ${item.gioiTinh === "Nam" ? "male" : "female"}`}>
                    {item.gioiTinh}
                  </span>
                </td>
                <td>
                  {formatDate(item.ngaySinh)}
                </td>
                <td>
                  <div style={{ fontSize: "0.875rem" }}>
                    {item.SDT && <div>📱 {item.SDT}</div>}
                    {item.email && <div className="ql-dv-user-email">✉️ {item.email}</div>}
                    {!item.SDT && !item.email && "—"}
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="ql-dv-btn-icon"
                      onClick={() => {
                        console.log("Eye button clicked, idDV:", item.idDV);
                        console.log("onViewDetail:", onViewDetail);
                        if (onViewDetail) {
                          onViewDetail(item.idDV);
                        } else {
                          console.error("onViewDetail is not defined!");
                        }
                      }}
                      title="Xem chi tiết"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="ql-dv-btn-icon"
                      onClick={() => onEdit && onEdit(item)}
                      title="Chỉnh sửa"
                    >
                      <Edit size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        onPageChange={onPageChange}
        loading={loading}
        itemLabel="đoàn viên"
      />
    </div>
  );
};

export default DoanVienTable;
