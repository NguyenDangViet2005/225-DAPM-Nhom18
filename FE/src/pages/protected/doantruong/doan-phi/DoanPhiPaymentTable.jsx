const fmtMoney = (n) => (n ? `${Number(n).toLocaleString()} ₫` : "—");
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "—");

const DoanPhiPaymentTable = ({ doanPhiList }) => {
  return (
    <table className="dp-table">
      <thead>
        <tr>
          <th>MSSV</th>
          <th>Họ và Tên</th>
          <th>Chi đoàn</th>
          <th>Năm học</th>
          <th>Số tiền</th>
          <th>Ngày đóng</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        {doanPhiList.map((p) => (
          <tr key={p.idDoanPhi}>
            <td className="dp-id-cell">{p.doanVien?.idDV ?? p.idDV}</td>
            <td style={{ fontWeight: 600 }}>
              {p.doanVien?.hoTen ?? "—"}
            </td>
            <td>
              {p.doanVien?.chiDoan?.tenChiDoan ??
                p.doanVien?.idChiDoan ??
                "—"}
            </td>
            <td>{p.mucDoanPhi?.namHoc ?? "—"}</td>
            <td className="dp-amount-cell">
              {fmtMoney(p.mucDoanPhi?.soTien)}
            </td>
            <td>{fmtDate(p.ngayDong)}</td>
            <td>
              <span
                className={`dp-badge ${
                  p.trangThai === "Đã đóng"
                    ? "dp-badge--paid"
                    : p.trangThai === "Đang chờ duyệt"
                      ? "dp-badge--pending"
                      : "dp-badge--unpaid"
                }`}
              >
                {p.trangThai}
              </span>
            </td>
          </tr>
        ))}
        {doanPhiList.length === 0 && (
          <tr>
            <td
              colSpan={7}
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#94a3b8",
              }}
            >
              Không có dữ liệu
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DoanPhiPaymentTable;
