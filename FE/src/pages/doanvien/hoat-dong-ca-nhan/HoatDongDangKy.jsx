import { useState, useMemo } from 'react';
import { CalendarCheck, MapPin, Users, Star, CheckCircle, Search } from 'lucide-react';
import { MOCK_HOAT_DONG, MOCK_DANG_KY_HOAT_DONG } from '@/data/mockHoatDong';
import '@/pages/bithu/bithu.css';
import './HoatDongCaNhan.css';

const MY_ID = '23110001';

const HoatDongDangKy = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [registered, setRegistered] = useState(
    MOCK_DANG_KY_HOAT_DONG.filter(r => r.idDV === MY_ID).map(r => r.idHD)
  );

  const available = useMemo(() =>
    MOCK_HOAT_DONG.filter(hd =>
      hd.trangThaiHD === 'Đang mở đăng ký' &&
      (hd.tenHD.toLowerCase().includes(searchTerm.toLowerCase()) ||
       hd.diaDiem.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [searchTerm]);

  return (
    <div className="bt-page">
      <div className="bt-header">
        <div>
          <h1 className="bt-title">Đăng ký hoạt động</h1>
          <p className="bt-subtitle">Các hoạt động đang mở đăng ký</p>
        </div>
      </div>

      <div className="bt-glass" style={{ padding: '0.875rem 1rem' }}>
        <div className="bt-search-wrap">
          <Search size={15} />
          <input className="bt-search-input" placeholder="Tìm tên hoạt động, địa điểm..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="hdcn-bt-grid">
        {available.map(hd => {
          const isReg = registered.includes(hd.idHD);
          const pct = Math.round((hd.soLuongDaDK / hd.soLuongMax) * 100);
          return (
            <div key={hd.idHD} className="bt-glass hdcn-bt-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="bt-status bt-status--open">Đang mở</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b' }}>
                  <Star size={13} /> {hd.diemHD} điểm
                </span>
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--bt-text)', marginBottom: '0.5rem' }}>{hd.tenHD}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--bt-text-muted)', lineHeight: 1.5, marginBottom: '0.875rem' }}>{hd.moTa}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--bt-text-muted)', marginBottom: '0.875rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><CalendarCheck size={13} /> {new Date(hd.ngayToChuc).toLocaleDateString('vi-VN')}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={13} /> {hd.diaDiem}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Users size={13} /> {hd.soLuongDaDK}/{hd.soLuongMax} đã đăng ký</span>
              </div>
              <div style={{ height: 6, background: 'rgba(0,79,159,0.1)', borderRadius: 3, overflow: 'hidden', marginBottom: '0.4rem' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--bt-blue), var(--bt-cyan))', borderRadius: 3 }} />
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--bt-text-light)', marginBottom: '1rem' }}>{pct}% đã đăng ký</p>
              <button
                style={{ width: '100%', padding: '0.65rem', borderRadius: 10, border: 'none', fontWeight: 700, fontSize: '0.875rem', cursor: isReg ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s',
                  background: isReg ? 'rgba(16,185,129,0.12)' : 'linear-gradient(135deg, var(--bt-blue), var(--bt-cyan))',
                  color: isReg ? '#059669' : '#fff',
                  boxShadow: isReg ? 'none' : '0 4px 14px rgba(0,79,159,0.25)',
                }}
                onClick={() => !isReg && setRegistered(prev => [...prev, hd.idHD])}
                disabled={isReg}
              >
                {isReg ? <><CheckCircle size={15} /> Đã đăng ký</> : 'Đăng ký tham gia'}
              </button>
            </div>
          );
        })}
        {available.length === 0 && (
          <p className="bt-empty" style={{ gridColumn: '1/-1' }}>Không có hoạt động nào đang mở đăng ký.</p>
        )}
      </div>
    </div>
  );
};

export default HoatDongDangKy;
