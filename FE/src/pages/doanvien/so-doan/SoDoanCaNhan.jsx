import { BookOpen, Calendar, MapPin, User, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import '@/pages/bithu/bithu.css';

const MY_SO_DOAN = {
  idSoDoan: 'SD23110001', idDV: '23110001',
  member: { hoTen: 'Nguyễn Văn Bí Thư', ngaySinh: '2005-03-15', gioiTinh: 'Nam', idChiDoan: '23110CL1A', khoa: 'Công nghệ thông tin', chucVu: 'Bí thư chi đoàn' },
  ngayCap: '2023-10-15', noiCap: 'Đoàn trường ĐH Sư phạm Kỹ thuật TP.HCM',
  trangThai: 'Đang lưu giữ', ngayRutSo: null, ghiChu: 'Hồ sơ đầy đủ',
};

const STATUS_CFG = {
  'Đang lưu giữ': { cls: 'bt-status--approved', icon: <CheckCircle size={12} /> },
  'Đã rút':       { cls: 'bt-status--rejected',  icon: <XCircle size={12} /> },
  'Thất lạc':     { cls: 'bt-status--pending',   icon: <AlertTriangle size={12} /> },
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: 'rgba(255,255,255,0.45)', borderRadius: 10, padding: '0.875rem', border: '1px solid rgba(255,255,255,0.5)' }}>
    <div style={{ color: 'var(--bt-blue)', flexShrink: 0, marginTop: 2 }}><Icon size={15} /></div>
    <div>
      <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, color: 'var(--bt-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{label}</span>
      <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--bt-text)' }}>{value || '—'}</span>
    </div>
  </div>
);

const SoDoanCaNhan = () => {
  const sd = MY_SO_DOAN;
  const cfg = STATUS_CFG[sd.trangThai] || {};
  return (
    <div className="bt-page">
      <div className="bt-header">
        <h1 className="bt-title">Sổ đoàn của tôi</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* Book card */}
        <div style={{ background: 'linear-gradient(135deg, #004f9f, #0369a1)', borderRadius: 16, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,79,159,0.25)' }}>
          <BookOpen size={44} color="rgba(255,255,255,0.9)" />
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', letterSpacing: 1 }}>{sd.idSoDoan}</div>
          <span className={`bt-status ${cfg.cls}`} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
            {cfg.icon} {sd.trangThai}
          </span>
          {sd.ghiChu && <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)' }}>{sd.ghiChu}</p>}
        </div>

        {/* Detail */}
        <div className="bt-glass" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--bt-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>Thông tin đoàn viên</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <InfoRow icon={User}     label="Họ và tên"  value={sd.member.hoTen} />
            <InfoRow icon={Calendar} label="Ngày sinh"  value={new Date(sd.member.ngaySinh).toLocaleDateString('vi-VN')} />
            <InfoRow icon={User}     label="Giới tính"  value={sd.member.gioiTinh} />
            <InfoRow icon={User}     label="Khoa"       value={sd.member.khoa} />
            <InfoRow icon={User}     label="Chi đoàn"   value={sd.member.idChiDoan} />
            <InfoRow icon={User}     label="Chức vụ"    value={sd.member.chucVu} />
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.5)', margin: '0 0 1.25rem' }} />
          <h3 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--bt-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>Thông tin sổ đoàn</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <InfoRow icon={Calendar} label="Ngày cấp" value={new Date(sd.ngayCap).toLocaleDateString('vi-VN')} />
            <InfoRow icon={MapPin}   label="Nơi cấp"  value={sd.noiCap} />
          </div>
          {sd.trangThai === 'Thất lạc' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10, color: '#d97706', fontSize: '0.875rem', fontWeight: 600, padding: '0.875rem 1rem', marginTop: '1.25rem' }}>
              <AlertTriangle size={15} /> Sổ đoàn đang thất lạc. Vui lòng liên hệ Đoàn trường để cấp lại.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoDoanCaNhan;
