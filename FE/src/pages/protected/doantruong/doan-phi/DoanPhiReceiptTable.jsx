const fmtMoney = (n) => (n ? `${Number(n).toLocaleString()} ₫` : "—");

const DoanPhiReceiptTable = ({ phieuThuList, onDuyet }) => {
  return (
    <table className="dp-table">
      <thead>
        <tr>
          <th>Mã Phiếu</th>
          <th>Người nộp</th>
          <th>File đính kèm</th>
          <th>Trạng thái</th>
          <th>Duyệt phiếu</th>
        </tr>
      </thead>
      <tbody>
        {phieuThuList.map((pt) => (
          <tr key={pt.idPhieuThu}>
            <td className="dp-id-cell">{pt.idPhieuThu}</td>
            <td style={{ fontWeight: 600 }}>
              {pt.nguoiNopTK?.doanVien?.hoTen ??
                pt.nguoiNopTK?.tenNguoiDung ??
                "—"}
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                {pt.nguoiNopTK?.doanVien?.chiDoan?.tenChiDoan ??
                  pt.nguoiNopTK?.doanVien?.idChiDoan ??
                  ""}
              </div>
            </td>
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
              <span
                className={`dp-badge ${
                  pt.trangThai === "Đã duyệt"
                    ? "dp-badge--paid"
                    : pt.trangThai === "Chờ duyệt"
                      ? "dp-badge--pending"
                      : "dp-badge--unpaid"
                }`}
              >
                {pt.trangThai}
              </span>
            </td>
            <td>
              {pt.trangThai === "Chờ duyệt" ? (
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    className="dp-update-btn"
                    style={{
                      padding: "0.4rem 0.8rem",
                      background: "#004f9f",
                      color: "#fff",
                      borderColor: "#004f9f",
                    }}
                    onClick={() => onDuyet(pt.idPhieuThu, "Đã duyệt")}
                  >
                    Duyệt
                  </button>
                  <button
                    className="dp-update-btn"
                    style={{
                      padding: "0.4rem 0.8rem",
                      color: "#b91c1c",
                      borderColor: "#fecaca",
                    }}
                    onClick={() => onDuyet(pt.idPhieuThu, "Từ chối")}
                  >
                    Từ chối
                  </button>
                </div>
              ) : (
                <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                  {pt.trangThai}
                </span>
              )}
            </td>
          </tr>
        ))}
        {phieuThuList.length === 0 && (
          <tr>
            <td colSpan={5} style={{ textAlign: "center", color: "#94a3b8" }}>
              Không có phiếu thu
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DoanPhiReceiptTable;
