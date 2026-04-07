import { BookOpen, Calendar, MapPin, User, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import './SoDoanCaNhan.css';

// Mock sổ đoàn của bản thân (idDV = '23110001' - bí thư)
const MY_SO_DOAN = {
  idSoDoan: 'SD23110001',
  idDV: '23110001',
  member: {
    hoTen: 'Nguyễn Văn Bí Thư',
    ngaySinh: '2005-03-15',
    gioiTinh: 'Nam',
    idChiDoan: '23110CL1A',
    khoa: 'Công nghệ thông tin',
    chucVu: 'Bí thư chi đoàn',
  },
  ngayCap: '2023-10-15',
  noiCap: 'Đoàn trường ĐH Sư phạm Kỹ thuật TP.HCM',
  trangThai: 'Đang lưu giữ',
  ngayRutSo: null,
  ghiChu: 'Hồ sơ đầy đủ',
};

const STATUS_CONFIG = {
  'Đang lưu giữ': { cls: 'sd-badge--active',  icon: <CheckCircle size={14} />, label: 'Đang lưu giữ' },
  'Đã rút':       { cls: 'sd-badge--withdrawn', icon: <XCircle size={14} />,    label: 'Đã rút' },
  'Thất lạc':     { cls: 'sd-badge--lost',      icon: <AlertTriangle size={14} />, label: 'Thất lạc' },
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="sd-info-row">
    <div className="sd-info-icon"><Icon size={16} /></div>
    <div>
      <span className="sd-info-label">{label}</span>
      <span className="sd-info-value">{value || '—'}</span>
    </div>
  </div>
);

const SoDoanCaNhan = () => {
  const sd = MY_SO_DOAN;
  const cfg = STATUS_CONFIG[sd.trangThai] || {};

  return (
    <div className="sd-container">
      <div className="sd-header">
        <h1 className="sd-title">Sổ đoàn của tôi</h1>
      </div>

      <div className="sd-layout">
        {/* Card sổ đoàn */}
        <div className="sd-book-card">
          <div className="sd-book-icon"><BookOpen size={40} /></div>
          <div className="sd-book-id">{sd.idSoDoan}</div>
          <span className={`sd-badge ${cfg.cls}`}>{cfg.icon} {cfg.label}</span>
          {sd.ghiChu && <p className="sd-book-note">{sd.ghiChu}</p>}
        </div>

        {/* Thông tin chi tiết */}
        <div className="sd-detail-card">
          <h3 className="sd-section-title">Thông tin đoàn viên</h3>
          <div className="sd-info-grid">
            <InfoRow icon={User}     label="Họ và tên"   value={sd.member.hoTen} />
            <InfoRow icon={Calendar} label="Ngày sinh"   value={new Date(sd.member.ngaySinh).toLocaleDateString('vi-VN')} />
            <InfoRow icon={User}     label="Giới tính"   value={sd.member.gioiTinh} />
            <InfoRow icon={User}     label="Khoa"        value={sd.member.khoa} />
            <InfoRow icon={User}     label="Chi đoàn"    value={sd.member.idChiDoan} />
            <InfoRow icon={User}     label="Chức vụ"     value={sd.member.chucVu} />
          </div>

          <div className="sd-divider" />

          <h3 className="sd-section-title">Thông tin sổ đoàn</h3>
          <div className="sd-info-grid">
            <InfoRow icon={Calendar} label="Ngày cấp"  value={new Date(sd.ngayCap).toLocaleDateString('vi-VN')} />
            <InfoRow icon={MapPin}   label="Nơi cấp"   value={sd.noiCap} />
            {sd.ngayRutSo && (
              <InfoRow icon={Calendar} label="Ngày rút sổ" value={new Date(sd.ngayRutSo).toLocaleDateString('vi-VN')} />
            )}
          </div>

          {sd.trangThai === 'Thất lạc' && (
            <div className="sd-alert">
              <AlertTriangle size={16} />
              Sổ đoàn đang trong tình trạng thất lạc. Vui lòng liên hệ Đoàn trường để làm thủ tục cấp lại.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoDoanCaNhan;
