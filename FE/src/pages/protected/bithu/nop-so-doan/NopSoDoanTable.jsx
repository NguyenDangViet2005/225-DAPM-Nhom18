import { CheckSquare, Square } from "lucide-react";
import { formatDate } from "@/utils";
import { SO_DOAN_STATUS } from "@/constants";

const NopSoDoanTable = ({ currentList, selectedIds, handleToggleSelect, loading }) => {
  const getStatusBadgeClass = (status) => {
    return status === SO_DOAN_STATUS.CHUA_NOP ? "nsd-badge--pending" : "nsd-badge--success";
  };

  return (
    <div className="nsd-table-wrapper">
      <table className="nsd-table">
        <thead>
          <tr>
            <th width="50" style={{ textAlign: "center" }}>
              Chọn
            </th>
            <th>Mã SV</th>
            <th>Họ Tên</th>
            <th>Ngày Sinh</th>
            <th>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="nsd-text-center">
                Đang tải danh sách...
              </td>
            </tr>
          ) : currentList.length === 0 ? (
            <tr>
              <td colSpan="5" className="nsd-text-center">
                Không tìm thấy sinh viên nào.
              </td>
            </tr>
          ) : (
            currentList.map((item) => {
              const checkId = item.idSoDoan || item.idDV;
              const isChecked = selectedIds.includes(checkId);
              const isOtherStatus = item.trangThai !== SO_DOAN_STATUS.CHUA_NOP;

              return (
                <tr key={checkId} className={isChecked ? "nsd-row-selected" : ""}>
                  <td style={{ textAlign: "center" }}>
                    {isOtherStatus ? (
                      <div className="nsd-check-disabled" title={item.trangThai}>
                        <CheckSquare size={18} color="#aaa" />
                      </div>
                    ) : (
                      <button className="nsd-check-btn" onClick={() => handleToggleSelect(item)}>
                        {isChecked ? (
                          <CheckSquare size={18} color="#2196f3" />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>
                    )}
                  </td>
                  <td>{item.doanVien?.idDV || item.idDV || "-"}</td>
                  <td className="nsd-fw-bold">{item.doanVien?.hoTen || "-"}</td>
                  <td>{formatDate(item.doanVien?.ngaySinh)}</td>
                  <td>
                    <span className={`nsd-badge ${getStatusBadgeClass(item.trangThai)}`}>
                      {item.trangThai || SO_DOAN_STATUS.CHUA_NOP}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NopSoDoanTable;
