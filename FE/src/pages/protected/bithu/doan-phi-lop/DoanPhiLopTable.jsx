import { Search } from "lucide-react";
import { formatMoney, formatDate } from "@/utils";
import { DOAN_PHI_STATUS } from "@/constants";
import Pagination from "@/components/commons/Pagination/Pagination";

const DoanPhiLopTable = ({
  doanPhiList,
  loading,
  checked,
  toggleCheck,
  isAllSelected,
  toggleSelectAll,
  availableToSelect,
  searchTerm,
  handleSearch,
  statusFilter,
  handleFilter,
  selectedCount,
  handleLapDanhSach,
  page,
  setPage,
  totalPages,
  soTien,
}) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case DOAN_PHI_STATUS.DA_DONG:
        return "dpl-badge--green";
      case DOAN_PHI_STATUS.DANG_CHO_DUYET:
        return "dpl-badge--blue";
      default:
        return "dpl-badge--amber";
    }
  };

  return (
    <div className="dpl-card">
      {/* Toolbar */}
      <div className="dpl-toolbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "12px" }}>
          <select className="dpl-select" value={statusFilter} onChange={(e) => handleFilter(e.target.value)}>
            <option value="all">Tất cả</option>
            <option value={DOAN_PHI_STATUS.DA_DONG}>Đã đóng</option>
            <option value={DOAN_PHI_STATUS.CHUA_DONG}>Chưa đóng</option>
            <option value={DOAN_PHI_STATUS.DANG_CHO_DUYET}>Đang chờ duyệt</option>
          </select>
          <div className="dpl-search-wrap">
            <Search size={15} className="dpl-search-icon" />
            <input
              className="dpl-search-input"
              placeholder="Tìm MSSV hoặc tên đoàn viên..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        {selectedCount > 0 && (
          <button className="dpl-btn dpl-btn--primary" onClick={handleLapDanhSach}>
            Lập danh sách ({selectedCount})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="dpl-table-wrap">
        <table className="dpl-table">
          <thead>
            <tr>
              <th style={{ width: 48 }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  disabled={availableToSelect.length === 0}
                />
              </th>
              <th>MSSV</th>
              <th>Họ và Tên</th>
              <th>Số tiền</th>
              <th>Ngày đóng</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="dpl-empty">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : (
              doanPhiList.map((p, idx) => (
                <tr key={p.idDoanPhi} className={idx % 2 === 1 ? "dpl-tr--alt" : ""}>
                  <td>
                    <input
                      type="checkbox"
                      checked={!!checked[p.idDoanPhi]}
                      onChange={() => toggleCheck(p.idDoanPhi)}
                      disabled={
                        p.trangThai === DOAN_PHI_STATUS.DA_DONG ||
                        p.trangThai === DOAN_PHI_STATUS.DANG_CHO_DUYET
                      }
                    />
                  </td>
                  <td className="dpl-td-mssv">{p.doanVien?.idDV || p.idDV}</td>
                  <td className="dpl-td-name">{p.doanVien?.hoTen}</td>
                  <td>{formatMoney(soTien)}</td>
                  <td className="dpl-td-muted">{formatDate(p.ngayDong)}</td>
                  <td>
                    <span className={`dpl-badge ${getStatusBadgeClass(p.trangThai)}`}>
                      {p.trangThai}
                    </span>
                  </td>
                </tr>
              ))
            )}
            {!loading && doanPhiList.length === 0 && (
              <tr>
                <td colSpan={6} className="dpl-empty">
                  Không tìm thấy đoàn viên nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={0}
        onPageChange={setPage}
        loading={loading}
        itemLabel="đoàn viên"
      />
    </div>
  );
};

export default DoanPhiLopTable;
