const STATUS_COLOR = {
  "Chờ duyệt": "#e53e3e",
  "Đã duyệt": "#38a169",
  "Từ chối": "#d69e2e",
};

const DashboardMembersTable = ({ members, loading, error }) => {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card__header">
        <h3 className="dashboard-card__title">Đoàn viên mới đăng ký</h3>
        <span className="dashboard-card__action">{members.length} hồ sơ</span>
      </div>
      <table className="member-table">
        <thead>
          <tr>
            <th>Sinh viên</th>
            <th>Mã SV</th>
            <th>Khoa</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={4} className="member-table__muted">
                Đang tải dữ liệu...
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td colSpan={4} className="member-table__muted">
                {error}
              </td>
            </tr>
          )}

          {!loading && !error && members.length === 0 && (
            <tr>
              <td colSpan={4} className="member-table__muted">
                Không có hồ sơ chờ duyệt phù hợp
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            members.map((row, i) => (
              <tr key={i}>
                <td>
                  <div className="member-table__name-cell">
                    <div className="member-table__avatar">
                      {(row.hoTen || "D").charAt(0)}
                    </div>
                    {row.hoTen}
                  </div>
                </td>
                <td className="member-table__muted">{row.maSV}</td>
                <td className="member-table__muted">{row.tenKhoa || "—"}</td>
                <td>
                  <span
                    className="member-table__status"
                    style={{
                      color: STATUS_COLOR[row.trangThaiDuyet] || "#718096",
                      backgroundColor: `${STATUS_COLOR[row.trangThaiDuyet] || "#718096"}15`,
                    }}
                  >
                    {row.trangThaiDuyet}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardMembersTable;
