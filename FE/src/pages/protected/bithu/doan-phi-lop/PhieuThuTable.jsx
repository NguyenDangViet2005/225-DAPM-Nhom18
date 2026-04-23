import { formatMoney, formatDate } from "@/utils";

const PhieuThuTable = ({ phieuThuList, loading }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Đã duyệt":
        return "dpl-badge--green";
      case "Chờ duyệt":
        return "dpl-badge--blue";
      default:
        return "dpl-badge--amber";
    }
  };

  return (
    <div className="dpl-card">
      <div className="dpl-table-wrap">
        <table className="dpl-table">
          <thead>
            <tr>
              <th>Mã Phiếu</th>
              <th>Ngày lập</th>
              <th>Tổng tiền</th>
              <th>File đính kèm</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="dpl-empty">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : (
              phieuThuList.map((pt, idx) => (
                <tr key={pt.idPhieuThu} className={idx % 2 === 1 ? "dpl-tr--alt" : ""}>
                  <td className="dpl-td-mssv">{pt.idPhieuThu}</td>
                  <td className="dpl-td-muted">{formatDate(pt.ngayLap)}</td>
                  <td>{formatMoney(pt.tongTien)}</td>
                  <td>
                    {pt.fileDinhKem ? (
                      pt.fileDinhKem.startsWith("http") ? (
                        <a
                          href={pt.fileDinhKem}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#004f9f", fontWeight: 500 }}
                        >
                          Xem file
                        </a>
                      ) : (
                        <span style={{ color: "#94a3b8", fontSize: "0.85em" }}>
                          File thử nghiệm cũ
                        </span>
                      )
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <span className={`dpl-badge ${getStatusBadgeClass(pt.trangThai)}`}>
                      {pt.trangThai}
                    </span>
                  </td>
                </tr>
              ))
            )}
            {!loading && phieuThuList.length === 0 && (
              <tr>
                <td colSpan={5} className="dpl-empty">
                  Bạn chưa gửi danh sách nộp nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PhieuThuTable;
