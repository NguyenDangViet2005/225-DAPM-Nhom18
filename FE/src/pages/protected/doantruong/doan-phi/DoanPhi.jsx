import { useState, useEffect } from 'react';
import { CreditCard, Download, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import useDoanPhi from '@/hooks/useDoanPhi';
import UpdateFeeModal from '@/components/commons/modals/UpdateMucDoanPhiModal';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import './DoanPhi.css';

const fmtMoney = (n) => n ? `${Number(n).toLocaleString()} ₫` : '—';
const fmtDate  = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

const DoanPhi = () => {
  const {
    mucDoanPhi, doanPhiList, phieuThuList, chiDoanList, stats, pagination,
    loading,
    fetchMucDoanPhi, createMucDoanPhi,
    fetchChiDoan, fetchDoanPhi,
    fetchPhieuThu, duyetPhieuThu,
  } = useDoanPhi();

  const [searchTerm, setSearchTerm]     = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [chiDoanFilter, setChiDoanFilter] = useState('all');
  const [activeTab, setActiveTab]       = useState('payments');
  const [showUpdateFee, setShowUpdateFee] = useState(false);
  const [newFee, setNewFee]             = useState({ namHoc: '', soTien: '' });

  useEffect(() => {
    fetchMucDoanPhi();
    fetchChiDoan();
  }, [fetchMucDoanPhi, fetchChiDoan]);

  useEffect(() => {
    if (activeTab === 'payments') {
      fetchDoanPhi({ search: searchTerm, trangThai: statusFilter, idChiDoan: chiDoanFilter });
    } else {
      fetchPhieuThu({ trangThai: statusFilter });
    }
  }, [activeTab, searchTerm, statusFilter, chiDoanFilter]);

  const currentRate = mucDoanPhi.find(r => r.trangThai === 'Đang áp dụng') ?? mucDoanPhi[0];

  const statCards = {
    tongPhaiThu: fmtMoney(stats?.tongPhaiThu ?? 0),
    daThu:       fmtMoney(stats?.tongDaThu   ?? 0),
    choDuyet:    phieuThuList.filter(r => r.trangThai === 'Chờ duyệt').length,
    tyLe:        stats ? `${stats.tyLe}%` : '0%',
  };

  const handleConfirmUpdate = async () => {
    const res = await createMucDoanPhi({ namHoc: newFee.namHoc, soTien: Number(newFee.soTien) });
    if (res?.success) {
      alert(`Đã cập nhật mức phí mới: ${Number(newFee.soTien).toLocaleString()} ₫`);
      setShowUpdateFee(false);
      setNewFee({ namHoc: '', soTien: '' });
    }
  };

  const handleDuyet = async (idPhieuThu, trangThai) => {
    const label = trangThai === 'Đã duyệt' ? 'duyệt' : 'từ chối';
    if (!window.confirm(`Xác nhận ${label} phiếu thu này?`)) return;
    await duyetPhieuThu(idPhieuThu, trangThai);
  };

  const paymentFilterOptions = [
    { value: 'all',           label: 'Tất cả trạng thái' },
    { value: 'Đã đóng',       label: 'Đã đóng' },
    { value: 'Chưa đóng',     label: 'Chưa đóng' },
    { value: 'Đang chờ duyệt', label: 'Đang chờ duyệt' },
  ];

  const receiptFilterOptions = [
    { value: 'all',       label: 'Tất cả trạng thái' },
    { value: 'Chờ duyệt', label: 'Chờ duyệt' },
    { value: 'Đã duyệt',  label: 'Đã duyệt' },
    { value: 'Từ chối',   label: 'Từ chối' },
  ];

  return (
    <div className="doan-phi-container">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="dp-header">
        <h1 className="dp-title">QUẢN LÝ ĐOÀN PHÍ</h1>
        <div className="dp-actions">
          <button className="dp-update-btn" style={{ borderColor: '#004f9f', color: '#004f9f' }}>
            <Download size={18} /> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* ── Current Fee Bar ────────────────────────────── */}
      <div className="dp-current-fee-bar">
        <div className="dp-current-fee-info">
          <span className="dp-current-fee-label">Mức đoàn phí đang áp dụng</span>
          <div className="dp-current-fee-value">
            {currentRate ? fmtMoney(currentRate.soTien) : '—'}
            <span className="dp-current-fee-sub">/ năm học {currentRate?.namHoc ?? ''}</span>
          </div>
        </div>
        <button className="dp-update-btn" onClick={() => setShowUpdateFee(true)}>
          <TrendingUp size={18} /> Cập nhật mức thu mới
        </button>
      </div>

      {/* ── Stats ──────────────────────────────────────── */}
      <div className="dp-stats">
        <div className="dp-stat-item">
          <span className="dp-stat-item__label">Tổng phải thu (Dự kiến)</span>
          <span className="dp-stat-item__value">{statCards.tongPhaiThu}</span>
          <CreditCard size={40} style={{ position: 'absolute', right: 20, bottom: 20, opacity: 0.05 }} />
        </div>
        <div className="dp-stat-item" style={{ borderLeft: '3px solid #15803d' }}>
          <span className="dp-stat-item__label">Đã thu thực tế</span>
          <span className="dp-stat-item__value">{statCards.daThu}</span>
          <CheckCircle size={40} style={{ position: 'absolute', right: 20, bottom: 20, opacity: 0.1, color: '#15803d' }} />
        </div>
        <div className="dp-stat-item" style={{ borderLeft: '3px solid #b45309' }}>
          <span className="dp-stat-item__label">Phiếu thu chờ duyệt</span>
          <span className="dp-stat-item__value">{statCards.choDuyet} Phiếu</span>
          <Clock size={40} style={{ position: 'absolute', right: 20, bottom: 20, opacity: 0.1, color: '#b45309' }} />
        </div>
        <div className="dp-stat-item" style={{ borderLeft: '3px solid #004f9f' }}>
          <span className="dp-stat-item__label">Tỷ lệ hoàn thành</span>
          <span className="dp-stat-item__value">{statCards.tyLe}</span>
          <TrendingUp size={40} style={{ position: 'absolute', right: 20, bottom: 20, opacity: 0.1, color: '#004f9f' }} />
        </div>
      </div>

      {/* ── Toolbar ────────────────────────────────────── */}
      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm kiếm đoàn viên, mã SV..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={activeTab === 'payments' ? paymentFilterOptions : receiptFilterOptions}
      >
        {activeTab === 'payments' && (
          <select
            value={chiDoanFilter}
            onChange={e => setChiDoanFilter(e.target.value)}
            style={{ padding: '0.65rem 1rem', border: '1.5px solid #e2e8f0', fontSize: '0.875rem', background: '#fff', minWidth: 180 }}
          >
            <option value="all">Tất cả chi đoàn</option>
            {chiDoanList.map(cd => (
              <option key={cd.idChiDoan} value={cd.idChiDoan}>{cd.tenChiDoan}</option>
            ))}
          </select>
        )}
      </DataTableToolbar>

      {/* ── Tabs ───────────────────────────────────────── */}
      <div className="dp-tabs">
        <div style={{ display: 'flex', borderBottom: '1px solid #eef2f6' }}>
          {[
            { key: 'payments', label: 'Danh sách Đoàn viên' },
            { key: 'receipts', label: `Phiếu thu (${phieuThuList.length})` },
            { key: 'rates',    label: 'Lịch sử mức phí' },
          ].map(t => (
            <button key={t.key} onClick={() => { setActiveTab(t.key); setStatusFilter('all'); setSearchTerm(''); }}
              style={{
                padding: '1rem 1.5rem', background: 'none', border: 'none',
                borderBottom: activeTab === t.key ? '3px solid #004f9f' : '3px solid transparent',
                fontWeight: 700, color: activeTab === t.key ? '#004f9f' : '#64748b', cursor: 'pointer',
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────── */}
      <div className="dp-card">
        {loading && <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Đang tải...</div>}

        {/* Tab: Danh sách đoàn viên */}
        {!loading && activeTab === 'payments' && (
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
              {doanPhiList.map(p => (
                <tr key={p.idDoanPhi}>
                  <td className="dp-id-cell">{p.doanVien?.idDV ?? p.idDV}</td>
                  <td style={{ fontWeight: 600 }}>{p.doanVien?.hoTen ?? '—'}</td>
                  <td>{p.doanVien?.chiDoan?.tenChiDoan ?? p.doanVien?.idChiDoan ?? '—'}</td>
                  <td>{p.mucDoanPhi?.namHoc ?? '—'}</td>
                  <td className="dp-amount-cell">{fmtMoney(p.mucDoanPhi?.soTien)}</td>
                  <td>{fmtDate(p.ngayDong)}</td>
                  <td>
                    <span className={`dp-badge ${
                      p.trangThai === 'Đã đóng'       ? 'dp-badge--paid' :
                      p.trangThai === 'Đang chờ duyệt' ? 'dp-badge--pending' :
                      'dp-badge--unpaid'
                    }`}>
                      {p.trangThai}
                    </span>
                  </td>
                </tr>
              ))}
              {doanPhiList.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        )}

        {/* Tab: Phiếu thu */}
        {!loading && activeTab === 'receipts' && (
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
              {phieuThuList.map(pt => (
                <tr key={pt.idPhieuThu}>
                  <td className="dp-id-cell">{pt.idPhieuThu}</td>
                  <td style={{ fontWeight: 600 }}>
                    {pt.nguoiNopTK?.doanVien?.hoTen ?? pt.nguoiNopTK?.tenNguoiDung ?? '—'}
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {pt.nguoiNopTK?.doanVien?.chiDoan?.tenChiDoan ?? pt.nguoiNopTK?.doanVien?.idChiDoan ?? ''}
                    </div>
                  </td>
                  <td>
                    {pt.fileDinhKem
                      ? <a href={pt.fileDinhKem} target="_blank" rel="noreferrer" style={{ color: '#004f9f', fontSize: '0.8rem' }}>Xem file</a>
                      : '—'}
                  </td>
                  <td>
                    <span className={`dp-badge ${
                      pt.trangThai === 'Đã duyệt' ? 'dp-badge--paid' :
                      pt.trangThai === 'Chờ duyệt' ? 'dp-badge--pending' :
                      'dp-badge--unpaid'
                    }`}>
                      {pt.trangThai}
                    </span>
                  </td>
                  <td>
                    {pt.trangThai === 'Chờ duyệt' ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="dp-update-btn"
                          style={{ padding: '0.4rem 0.8rem', background: '#004f9f', color: '#fff', borderColor: '#004f9f' }}
                          onClick={() => handleDuyet(pt.idPhieuThu, 'Đã duyệt')}>
                          Duyệt
                        </button>
                        <button className="dp-update-btn"
                          style={{ padding: '0.4rem 0.8rem', color: '#b91c1c', borderColor: '#fecaca' }}
                          onClick={() => handleDuyet(pt.idPhieuThu, 'Từ chối')}>
                          Từ chối
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{pt.trangThai}</span>
                    )}
                  </td>
                </tr>
              ))}
              {phieuThuList.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        )}

        {/* Tab: Lịch sử mức phí */}
        {!loading && activeTab === 'rates' && (
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
              {mucDoanPhi.map(m => (
                <tr key={m.idMucDP}>
                  <td className="dp-id-cell">{m.idMucDP}</td>
                  <td style={{ fontWeight: 600 }}>{m.namHoc}</td>
                  <td className="dp-amount-cell">{fmtMoney(m.soTien)}</td>
                  <td>
                    <span className={`dp-badge ${m.trangThai === 'Đang áp dụng' ? 'dp-badge--paid' : 'dp-badge--pending'}`}>
                      {m.trangThai}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal cập nhật mức phí ─────────────────────── */}
      <UpdateFeeModal
        show={showUpdateFee}
        onClose={() => setShowUpdateFee(false)}
        onConfirm={handleConfirmUpdate}
        feeValue={newFee.soTien}
        setFeeValue={(v) => setNewFee(prev => ({ ...prev, soTien: v }))}
        namHoc={newFee.namHoc}
        setNamHoc={(v) => setNewFee(prev => ({ ...prev, namHoc: v }))}
      />
    </div>
  );
};

export default DoanPhi;
