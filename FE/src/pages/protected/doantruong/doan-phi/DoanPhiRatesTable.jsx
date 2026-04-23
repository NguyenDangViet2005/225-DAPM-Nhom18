const fmtMoney = (n) => (n ? `${Number(n).toLocaleString()} ₫` : "—");

const DoanPhiRatesTable = ({ mucDoanPhi }) => {
  return (
    <table className="dp-table">
      <thead>
        <tr>
          <th>Mã</th>
          <th>Năm học</th>
          <th>Số tiền</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        {mucDoanPhi.map((m) => (
          <tr key={m.idMucDP}>
            <td className="dp-id-cell">{m.idMucDP}</td>
            <td style={{ fontWeight: 600 }}>{m.namHoc}</td>
            <td className="dp-amount-cell">{fmtMoney(m.soTien)}</td>
            <td>
              <span
                className={`dp-badge ${m.trangThai === "Đang áp dụng" ? "dp-badge--paid" : "dp-badge--pending"}`}
              >
                {m.trangThai}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DoanPhiRatesTable;
