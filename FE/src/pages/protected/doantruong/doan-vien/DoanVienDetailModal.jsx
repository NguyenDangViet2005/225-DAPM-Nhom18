import { useState, useEffect } from "react";
import { doanvienAPI } from "@/apis/doanvien.api";
import { formatDate, formatDateTime } from "@/utils/dateFormat";
import "./DoanVienDetailModal.css";

const DoanVienDetailModal = ({ show, idDV, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("thongtin");

  useEffect(() => {
    if (show && idDV) {
      fetchDetail();
    }
  }, [show, idDV]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const response = await doanvienAPI.getFullDetail(idDV);
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin đoàn viên:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="dv-detail-overlay" onClick={onClose}>
      <div className="dv-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dv-detail-header">
          <h2>Thông tin chi tiết đoàn viên</h2>
          <button className="dv-detail-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {loading ? (
          <div className="dv-detail-loading">Đang tải...</div>
        ) : data ? (
          <>
            <div className="dv-detail-top">
              <div className="dv-detail-avatar">
                {data.thongTinCaNhan.anhThe ? (
                  <img src={data.thongTinCaNhan.anhThe} alt="Ảnh thẻ" />
                ) : (
                  <div className="dv-detail-avatar-placeholder">
                    {data.thongTinCaNhan.hoTen?.charAt(0) || "?"}
                  </div>
                )}
              </div>
              <div className="dv-detail-summary">
                <h3>{data.thongTinCaNhan.hoTen}</h3>
                <p>MSSV: {data.thongTinCaNhan.idDV}</p>
                <p>Chi đoàn: {data.thongTinDoan.tenChiDoan || "Chưa có"}</p>
                <p>Khoa: {data.thongTinDoan.tenKhoa || "Chưa có"}</p>
                <div className="dv-detail-badges">
                  <span className="badge badge-primary">
                    Điểm: {data.thongTinDoan.diemHoatDong || 0}
                  </span>
                  <span className={`badge ${data.thongTinCaNhan.trangThaiHoc === "Đang học" ? "badge-success" : "badge-warning"}`}>
                    {data.thongTinCaNhan.trangThaiHoc}
                  </span>
                </div>
              </div>
            </div>

            <div className="dv-detail-tabs">
              <button
                className={activeTab === "thongtin" ? "active" : ""}
                onClick={() => setActiveTab("thongtin")}
              >
                Thông tin cá nhân
              </button>
              <button
                className={activeTab === "sodoan" ? "active" : ""}
                onClick={() => setActiveTab("sodoan")}
              >
                Sổ đoàn
              </button>
              <button
                className={activeTab === "doanphi" ? "active" : ""}
                onClick={() => setActiveTab("doanphi")}
              >
                Đoàn phí
              </button>
              <button
                className={activeTab === "hoatdong" ? "active" : ""}
                onClick={() => setActiveTab("hoatdong")}
              >
                Hoạt động
              </button>
            </div>

            <div className="dv-detail-content">
              {activeTab === "thongtin" && (
                <ThongTinCaNhanTab data={data.thongTinCaNhan} thongTinDoan={data.thongTinDoan} />
              )}
              {activeTab === "sodoan" && (
                <SoDoanTab soDoan={data.soDoan} lichSuChuyen={data.lichSuChuyenChiDoan} />
              )}
              {activeTab === "doanphi" && (
                <DoanPhiTab doanPhis={data.doanPhis} />
              )}
              {activeTab === "hoatdong" && (
                <HoatDongTab lichSuHoatDong={data.lichSuHoatDong} />
              )}
            </div>
          </>
        ) : (
          <div className="dv-detail-error">Không tìm thấy thông tin</div>
        )}
      </div>
    </div>
  );
};

const ThongTinCaNhanTab = ({ data, thongTinDoan }) => (
  <div className="dv-detail-section">
    <div className="dv-detail-grid">
      <InfoRow label="Họ và tên" value={data.hoTen} />
      <InfoRow label="Giới tính" value={data.gioiTinh} />
      <InfoRow label="Ngày sinh" value={formatDate(data.ngaySinh)} />
      <InfoRow label="Số điện thoại" value={data.SDT} />
      <InfoRow label="Email" value={data.email} />
      <InfoRow label="CCCD" value={data.CCCD} />
      <InfoRow label="Ngày cấp CCCD" value={formatDate(data.ngayCapCCCD)} />
      <InfoRow label="Nơi cấp CCCD" value={data.noiCapCCCD} />
      <InfoRow label="Dân tộc" value={data.danToc} />
      <InfoRow label="Tôn giáo" value={data.tonGiao} />
      <InfoRow label="Địa chỉ thường trú" value={data.diaChiThuongTru} fullWidth />
      <InfoRow label="Địa chỉ tạm trú" value={data.diaChiTamTru} fullWidth />
      <InfoRow label="Hệ đào tạo" value={data.heDaoTao} />
      <InfoRow label="Trạng thái học" value={data.trangThaiHoc} />
      <InfoRow label="Chi đoàn" value={thongTinDoan.tenChiDoan} />
      <InfoRow label="Niên khóa" value={thongTinDoan.nienKhoa} />
      <InfoRow label="Khoa" value={thongTinDoan.tenKhoa} />
      <InfoRow label="Chức vụ" value={thongTinDoan.chucVu || "Đoàn viên"} />
      <InfoRow label="Điểm hoạt động" value={thongTinDoan.diemHoatDong || 0} />
    </div>
  </div>
);

const SoDoanTab = ({ soDoan, lichSuChuyen }) => (
  <div className="dv-detail-section">
    {soDoan ? (
      <>
        <h4>Thông tin sổ đoàn</h4>
        <div className="dv-detail-grid">
          <InfoRow label="Mã sổ đoàn" value={soDoan.idSoDoan} />
          <InfoRow label="Ngày cấp" value={formatDate(soDoan.ngayCap)} />
          <InfoRow label="Nơi cấp" value={soDoan.noiCap} />
          <InfoRow label="Trạng thái" value={soDoan.trangThai} />
          <InfoRow label="Ngày vào đoàn" value={formatDate(soDoan.ngayVaoDoan)} />
          <InfoRow label="Nơi kết nạp" value={soDoan.noiKetNap} />
          <InfoRow label="Ngày rút sổ" value={formatDate(soDoan.ngayRutSo)} />
        </div>

        {lichSuChuyen && lichSuChuyen.length > 0 && (
          <>
            <h4 style={{ marginTop: "24px" }}>Lịch sử chuyển chi đoàn</h4>
            <div className="dv-detail-table">
              <table>
                <thead>
                  <tr>
                    <th>Từ đơn vị</th>
                    <th>Đến đơn vị</th>
                    <th>Ngày bắt đầu</th>
                    <th>Ngày kết thúc</th>
                    <th>Lý do</th>
                  </tr>
                </thead>
                <tbody>
                  {lichSuChuyen.map((ls) => (
                    <tr key={ls.idLichSu}>
                      <td>{ls.tuDonVi}</td>
                      <td>{ls.denDonVi}</td>
                      <td>{formatDate(ls.ngayBatDau)}</td>
                      <td>{formatDate(ls.ngayKetThu)}</td>
                      <td>{ls.lyDo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </>
    ) : (
      <div className="dv-detail-empty">Chưa có thông tin sổ đoàn</div>
    )}
  </div>
);

const DoanPhiTab = ({ doanPhis }) => (
  <div className="dv-detail-section">
    <h4>Tình trạng đoàn phí</h4>
    {doanPhis && doanPhis.length > 0 ? (
      <div className="dv-detail-table">
        <table>
          <thead>
            <tr>
              <th>Năm học</th>
              <th>Số tiền</th>
              <th>Trạng thái</th>
              <th>Ngày đóng</th>
              <th>Ngày lập phiếu</th>
              <th>File đính kèm</th>
            </tr>
          </thead>
          <tbody>
            {doanPhis.map((dp) => (
              <tr key={dp.idDoanPhi}>
                <td>{dp.namHoc}</td>
                <td>{dp.soTien?.toLocaleString("vi-VN")} đ</td>
                <td>
                  <span className={`badge ${dp.trangThai === "Đã đóng" ? "badge-success" : "badge-warning"}`}>
                    {dp.trangThai}
                  </span>
                </td>
                <td>{formatDate(dp.ngayDong)}</td>
                <td>{formatDate(dp.ngayLapPhieu)}</td>
                <td>
                  {dp.fileDinhKem ? (
                    <a href={dp.fileDinhKem} target="_blank" rel="noopener noreferrer">
                      Xem file
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="dv-detail-empty">Chưa có thông tin đoàn phí</div>
    )}
  </div>
);

const HoatDongTab = ({ lichSuHoatDong }) => (
  <div className="dv-detail-section">
    <h4>Lịch sử tham gia hoạt động</h4>
    {lichSuHoatDong && lichSuHoatDong.length > 0 ? (
      <div className="dv-detail-table">
        <table>
          <thead>
            <tr>
              <th>Tên hoạt động</th>
              <th>Ngày tổ chức</th>
              <th>Địa điểm</th>
              <th>Điểm</th>
              <th>Trạng thái hoạt động</th>
              <th>Ngày đăng ký</th>
              <th>Trạng thái duyệt</th>
            </tr>
          </thead>
          <tbody>
            {lichSuHoatDong.map((hd, index) => (
              <tr key={`${hd.idHD}-${index}`}>
                <td>{hd.tenHD}</td>
                <td>{formatDateTime(hd.ngayToChuc)}</td>
                <td>{hd.diaDiem}</td>
                <td>{hd.diemHD}</td>
                <td>
                  <span className={`badge ${hd.trangThaiHD === "Đã hoàn thành" ? "badge-success" : "badge-info"}`}>
                    {hd.trangThaiHD}
                  </span>
                </td>
                <td>{formatDateTime(hd.ngayDangKi)}</td>
                <td>
                  <span className={`badge ${
                    hd.trangThaiDuyet === "Đã duyệt" ? "badge-success" :
                    hd.trangThaiDuyet === "Từ chối" ? "badge-danger" : "badge-warning"
                  }`}>
                    {hd.trangThaiDuyet}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="dv-detail-empty">Chưa tham gia hoạt động nào</div>
    )}
  </div>
);

const InfoRow = ({ label, value, fullWidth }) => (
  <div className={`dv-info-row ${fullWidth ? "full-width" : ""}`}>
    <span className="dv-info-label">{label}:</span>
    <span className="dv-info-value">{value || "—"}</span>
  </div>
);

export default DoanVienDetailModal;
