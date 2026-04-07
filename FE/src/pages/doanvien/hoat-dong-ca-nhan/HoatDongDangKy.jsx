import { useState, useMemo } from 'react';
import { CalendarCheck, MapPin, Users, Star, CheckCircle } from 'lucide-react';
import { MOCK_HOAT_DONG, MOCK_DANG_KY_HOAT_DONG } from '@/data/mockHoatDong';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import './HoatDongCaNhan.css';

const MY_ID = '23110001';

const HoatDongDangKy = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [registered, setRegistered] = useState(
    MOCK_DANG_KY_HOAT_DONG.filter(r => r.idDV === MY_ID).map(r => r.idHD)
  );

  // Chỉ hiện hoạt động đang mở đăng ký
  const available = useMemo(() =>
    MOCK_HOAT_DONG.filter(hd =>
      hd.trangThaiHD === 'Đang mở đăng ký' &&
      (hd.tenHD.toLowerCase().includes(searchTerm.toLowerCase()) ||
       hd.diaDiem.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [searchTerm]);

  const handleRegister = (idHD) => {
    setRegistered(prev => [...prev, idHD]);
  };

  return (
    <div className="hdcn-container">
      <div className="hdcn-header">
        <h1 className="hdcn-title">Đăng ký hoạt động</h1>
      </div>

      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm tên hoạt động, địa điểm..."
      />

      <div className="hdcn-grid">
        {available.map(hd => {
          const isReg = registered.includes(hd.idHD);
          const pct = Math.round((hd.soLuongDaDK / hd.soLuongMax) * 100);
          return (
            <div key={hd.idHD} className="hdcn-activity-card">
              <div className="hdcn-activity-card__top">
                <span className="hdcn-badge hdcn-badge--open">Đang mở</span>
                <span className="hdcn-points"><Star size={13} /> {hd.diemHD} điểm</span>
              </div>
              <h3 className="hdcn-activity-name">{hd.tenHD}</h3>
              <p className="hdcn-activity-desc">{hd.moTa}</p>
              <div className="hdcn-activity-meta">
                <span><CalendarCheck size={13} /> {new Date(hd.ngayToChuc).toLocaleDateString('vi-VN')}</span>
                <span><MapPin size={13} /> {hd.diaDiem}</span>
                <span><Users size={13} /> {hd.soLuongDaDK}/{hd.soLuongMax}</span>
              </div>
              <div className="hdcn-progress-wrap">
                <div className="hdcn-progress-bar" style={{ width: `${pct}%` }} />
              </div>
              <p className="hdcn-progress-label">{pct}% đã đăng ký</p>
              <button
                className={`hdcn-register-btn ${isReg ? 'hdcn-register-btn--done' : ''}`}
                onClick={() => !isReg && handleRegister(hd.idHD)}
                disabled={isReg}
              >
                {isReg ? <><CheckCircle size={15} /> Đã đăng ký</> : 'Đăng ký tham gia'}
              </button>
            </div>
          );
        })}
        {available.length === 0 && (
          <p className="hdcn-empty">Không có hoạt động nào đang mở đăng ký.</p>
        )}
      </div>
    </div>
  );
};

export default HoatDongDangKy;
