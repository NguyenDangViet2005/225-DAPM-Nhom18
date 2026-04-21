import { useState, useEffect, useCallback } from 'react';
import {
  UserPlus, ShieldCheck, UserX, Key, Edit,
  Circle, Building, X, Save, Loader, Users, RefreshCw,
} from 'lucide-react';
import {
  getAllTaiKhoanAPI, createTaiKhoanAPI, updateTaiKhoanAPI,
  resetPasswordAPI, toggleTrangThaiAPI, getTaiKhoanStatsAPI,
  getAllVaiTroAPI, getDoanVienDropdownAPI, getKhoaDropdownAPI,
} from '@/apis/taikhoan.api';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import SearchableSelect from '@/components/commons/SearchableSelect/SearchableSelect';
import './TaiKhoan.css';

/* ─── Initial form states ─────────────────────────────────── */
const EMPTY_FORM = { tenNguoiDung: '', matKhau: '', idVaiTro: '', idDV: '', idKhoa: '' };
const EMPTY_RESET = { matKhauMoi: '', xacNhanMatKhau: '' };


const getVaiTroType = (idVaiTro, vaiTroList) => {
  const vt = vaiTroList.find(v => v.idVaiTro === idVaiTro);
  if (!vt) return null;
  const name = vt.tenVaiTro.toLowerCase();
  if (name.includes('trường') || name.includes('truong') || name.includes('thường vụ')) return 'DOANTRUONG';
  if (name.includes('khoa') || name.includes('liên chi')) return 'DOANKHOA';
  return 'DOANVIEN'; // bí thư lớp, đoàn viên
};

/* ─── Component ──────────────────────────────────────────── */
const TaiKhoan = () => {
  // ── Data ──
  const [accounts, setAccounts] = useState([]);
  const [stats, setStats] = useState({ tongTaiKhoan: 0, dangHoatDong: 0, daKhoa: 0 });
  const [vaiTroList, setVaiTroList] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // ── Filter ──
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // ── Loading / error ──
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Dropdown data for modal ──
  const [doanVienList, setDoanVienList] = useState([]);
  const [khoaList, setKhoaList] = useState([]);
  const [isDropdownLoading, setIsDropdownLoading] = useState(false);

  // ── Modal: create / edit ──
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Modal: reset password ──
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetTarget, setResetTarget] = useState(null);
  const [resetForm, setResetForm] = useState(EMPTY_RESET);
  const [resetError, setResetError] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // ── Fetch accounts ───────────────────────────────────────
  const fetchAccounts = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await getAllTaiKhoanAPI({ page, limit: pagination.limit, search: searchTerm, idVaiTro: roleFilter });
      if (res.success) { setAccounts(res.data); setPagination(res.pagination); }
    } catch {
      setError('Không thể tải danh sách tài khoản. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, roleFilter, pagination.limit]);

  const fetchStats = useCallback(async () => {
    try { const r = await getTaiKhoanStatsAPI(); if (r.success) setStats(r.data); } catch {}
  }, []);

  const fetchVaiTro = useCallback(async () => {
    try { const r = await getAllVaiTroAPI(); if (r.success) setVaiTroList(r.data); } catch {}
  }, []);

  useEffect(() => { fetchVaiTro(); fetchStats(); }, [fetchVaiTro, fetchStats]);
  useEffect(() => { fetchAccounts(1); }, [searchTerm, roleFilter]); // eslint-disable-line

  // ── Toolbar filter options ───────────────────────────────
  const roleFilterOptions = [
    { value: '', label: 'Tất cả vai trò' },
    ...vaiTroList.map(vt => ({ value: vt.idVaiTro, label: vt.tenVaiTro })),
  ];

  // ── Fetch dropdown data khi mở modal ────────────────────
  const fetchDropdowns = useCallback(async (excludeIdDV = null) => {
    setIsDropdownLoading(true);
    try {
      const [dvRes, khoaRes] = await Promise.all([getDoanVienDropdownAPI(excludeIdDV), getKhoaDropdownAPI()]);
      if (dvRes.success) setDoanVienList(dvRes.data);
      if (khoaRes.success) setKhoaList(khoaRes.data);
    } catch {} finally { setIsDropdownLoading(false); }
  }, []);

  // ── Open create modal ─────────────────────────────────────
  const openCreate = () => {
    setEditTarget(null); setForm(EMPTY_FORM); setFormError('');
    setShowModal(true); fetchDropdowns(null);
  };

  // ── Open edit modal ───────────────────────────────────────
  const openEdit = (tk) => {
    setEditTarget(tk);
    setForm({ tenNguoiDung: tk.tenNguoiDung, matKhau: '', idVaiTro: tk.idVaiTro || '', idDV: tk.idDV || '', idKhoa: tk.idKhoa || '' });
    setFormError(''); setShowModal(true);
    fetchDropdowns(tk.idDV || null);
  };

  // ── Submit create / edit ──────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.tenNguoiDung.trim()) { setFormError('Tên đăng nhập không được để trống'); return; }
    if (!editTarget && !form.matKhau) { setFormError('Mật khẩu không được để trống'); return; }
    if (!form.idVaiTro) { setFormError('Vui lòng chọn vai trò'); return; }

    const roleType = getVaiTroType(form.idVaiTro, vaiTroList);
    
    // Validate theo vai trò
    if (roleType === 'DOANKHOA' && !form.idKhoa) { 
      setFormError('Đoàn Khoa phải chọn Khoa phụ trách'); 
      return; 
    }
    if (roleType === 'DOANVIEN' && !form.idDV) { 
      setFormError('Bí thư/Đoàn viên phải nhập mã sinh viên'); 
      return; 
    }

    setIsSubmitting(true);
    try {
      if (editTarget) {
        const payload = { tenNguoiDung: form.tenNguoiDung.trim(), idVaiTro: form.idVaiTro.trim() };
        if (roleType === 'DOANVIEN') payload.idDV = form.idDV.trim();
        else payload.idDV = null;
        if (roleType === 'DOANKHOA') payload.idKhoa = form.idKhoa.trim();
        else payload.idKhoa = null;
        await updateTaiKhoanAPI(editTarget.idUser, payload);
      } else {
        const payload = {
          tenNguoiDung: form.tenNguoiDung.trim(),
          matKhau: form.matKhau,
          idVaiTro: form.idVaiTro.trim(),
        };
        if (roleType === 'DOANVIEN') payload.idDV = form.idDV.trim();
        if (roleType === 'DOANKHOA') payload.idKhoa = form.idKhoa.trim();
        await createTaiKhoanAPI(payload);
      }
      setShowModal(false); fetchAccounts(pagination.page); fetchStats();
    } catch (err) {
      const resData = err?.response?.data;
      if (resData?.errors && Array.isArray(resData.errors) && resData.errors.length > 0) {
        // Hiện chi tiết lỗi validation từ BE
        const details = resData.errors.map(e => `• ${e.msg} (${e.path})`).join('\n');
        setFormError(`${resData.message}:\n${details}`);
      } else {
        setFormError(resData?.message || 'Có lỗi xảy ra, vui lòng thử lại');
      }

    } finally { setIsSubmitting(false); }
  };

  // ── Toggle trạng thái ─────────────────────────────────────
  const handleToggleStatus = async (tk) => {
    if (!window.confirm(`Bạn có chắc muốn ${tk.trangThai ? 'khóa' : 'mở khóa'} tài khoản "${tk.tenNguoiDung}"?`)) return;
    try { await toggleTrangThaiAPI(tk.idUser); fetchAccounts(pagination.page); fetchStats(); }
    catch { alert('Có lỗi khi thay đổi trạng thái tài khoản'); }
  };

  // ── Reset password modal ──────────────────────────────────
  const openReset = (tk) => { setResetTarget(tk); setResetForm(EMPTY_RESET); setResetError(''); setShowResetModal(true); };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    if (!resetForm.matKhauMoi) { setResetError('Mật khẩu mới không được để trống'); return; }
    if (resetForm.matKhauMoi.length < 6) { setResetError('Mật khẩu phải ít nhất 6 ký tự'); return; }
    if (resetForm.matKhauMoi !== resetForm.xacNhanMatKhau) { setResetError('Mật khẩu xác nhận không khớp'); return; }
    setIsResetting(true);
    try {
      await resetPasswordAPI(resetTarget.idUser, resetForm.matKhauMoi);
      setShowResetModal(false);
      alert(`Đặt lại mật khẩu cho "${resetTarget.tenNguoiDung}" thành công!`);
    } catch (err) { setResetError(err?.response?.data?.message || 'Có lỗi xảy ra'); }
    finally { setIsResetting(false); }
  };

  // ── Render form fields theo vai trò ──────────────────────
  const renderRoleFields = () => {
    const roleType = getVaiTroType(form.idVaiTro, vaiTroList);

    // DOANTRUONG → không cần thêm gì
    if (!roleType || roleType === 'DOANTRUONG') return null;

    // DOANKHOA → chỉ cần chọn Khoa
    if (roleType === 'DOANKHOA') {
      return (
        <div className="tk-form-group">
          <label className="tk-form-label">
            Mã Khoa (Khoa phụ trách) <span className="req">*</span>
            {isDropdownLoading && <Loader size={12} className="tk-spin" style={{ marginLeft: 6 }} />}
          </label>
          <div className="tk-dv-input-row" style={{ gridTemplateColumns: 'minmax(120px, 1fr) 2fr' }}>
            <input
              id="input-id-khoa"
              className="tk-form-input tk-dv-manual"
              type="text"
              placeholder="Mã (VD: CNTT)"
              value={form.idKhoa}
              onChange={e => setForm(f => ({ ...f, idKhoa: e.target.value }))}
              disabled={isDropdownLoading}
            />
            <div className="tk-dv-search">
              <select
                id="select-id-khoa"
                className="tk-form-input"
                value={form.idKhoa}
                onChange={e => setForm(f => ({ ...f, idKhoa: e.target.value }))}
                disabled={isDropdownLoading}
                style={{ width: '100%' }}
              >
                <option value="">-- Hoặc chọn DS có sẵn --</option>
                {khoaList.map(k => (
                  <option key={k.idKhoa} value={k.idKhoa}>
                    [{k.idKhoa}] {k.tenKhoa}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      );
    }

    // DOANVIEN (Bí thư chi đoàn / Đoàn viên) → hiển thị form đoàn viên hoặc tìm kiếm
    if (roleType === 'DOANVIEN') {
      return (
        <div className="tk-form-group" style={{ marginTop: '1rem' }}>
          <label className="tk-form-label">
            Liên kết Đoàn viên{' '}
            <span style={{ color: '#64748b', fontWeight: 400, textTransform: 'none', fontSize: '0.72rem' }}>
              (Tìm kiếm theo mã SV để liên kết hoặc nhập mã SV mới)
            </span>
            {isDropdownLoading && <Loader size={12} className="tk-spin" style={{ marginLeft: 6 }} />}
          </label>
          <div className="tk-dv-input-row">
            <input
              id="input-id-dv"
              className="tk-form-input tk-dv-manual"
              type="text"
              placeholder="Nhập mã sinh viên..."
              value={form.idDV}
              onChange={e => setForm(f => ({ ...f, idDV: e.target.value }))}
            />
            <div className="tk-dv-search">
              <SearchableSelect
                id="searchable-id-dv"
                value={form.idDV}
                onChange={val => setForm(f => ({ ...f, idDV: val }))}
                disabled={isDropdownLoading}
                placeholder="Hoặc tìm trong DS Đoàn viên..."
                emptyText="Không tìm thấy đoàn viên chưa có tài khoản"
                options={[
                  ...(editTarget?.idDV && !doanVienList.find(dv => dv.idDV === editTarget.idDV)
                    ? [{ value: editTarget.idDV, label: editTarget.doanVien?.hoTen || editTarget.idDV, sub: '(Đoàn viên hiện tại)' }]
                    : []),
                  ...doanVienList.map(dv => ({
                    value: dv.idDV,
                    label: dv.hoTen,
                    sub: [dv.chiDoan?.tenChiDoan, dv.chucVu, dv.idDV].filter(Boolean).join(' • '),
                  }))
                ]}
              />
            </div>
          </div>
          <span className="tk-dv-hint">
            💡 Nhập mã sinh viên mới để tạo đoàn viên và tài khoản cùng lúc, hoặc tìm kiếm đoàn viên đã có để liên kết tài khoản.
            Nếu đoàn viên đã có tài khoản sẽ báo lỗi.
          </span>
        </div>
      );
    }

    return null;
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div className="tk-container">
      {/* ── Header ── */}
      <div className="tk-header">
        <h1 className="tk-title">Quản lý Tài khoản &amp; Phân quyền</h1>
        <div className="tk-actions">
          <button className="tk-btn-primary" id="btn-them-tai-khoan" onClick={openCreate}>
            <UserPlus size={18} /> Thêm tài khoản mới
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="tk-stats">
        <div className="tk-stat-item">
          <span className="tk-stat-item__label">Tổng người dùng</span>
          <span className="tk-stat-item__value">{stats.tongTaiKhoan}</span>
          <Users size={32} className="tk-stat-item__bg-icon" />
        </div>
        <div className="tk-stat-item" style={{ borderLeft: '3px solid #15803d' }}>
          <span className="tk-stat-item__label">Đang hoạt động</span>
          <span className="tk-stat-item__value">{stats.dangHoatDong}</span>
          <ShieldCheck size={32} className="tk-stat-item__bg-icon" style={{ color: '#15803d' }} />
        </div>
        <div className="tk-stat-item" style={{ borderLeft: '3px solid #b91c1c' }}>
          <span className="tk-stat-item__label">Đã khóa / Tạm dừng</span>
          <span className="tk-stat-item__value">{stats.daKhoa}</span>
          <UserX size={32} className="tk-stat-item__bg-icon" style={{ color: '#b91c1c' }} />
        </div>
      </div>

      {/* ── Toolbar ── */}
      <DataTableToolbar
        searchTerm={searchTerm} onSearchChange={setSearchTerm}
        placeholder="Tìm theo Tên đăng nhập..."
        filterValue={roleFilter} onFilterChange={setRoleFilter}
        filterOptions={roleFilterOptions}
      />

      {/* ── Error banner ── */}
      {error && (
        <div className="tk-error-banner">
          {error}
          <button onClick={() => fetchAccounts(1)}><RefreshCw size={14} /></button>
        </div>
      )}

      {/* ── Table ── */}
      <div className="tk-card">
        {isLoading ? (
          <div className="tk-loading"><Loader size={28} className="tk-spin" /> Đang tải...</div>
        ) : accounts.length === 0 ? (
          <div className="tk-empty">Không có tài khoản nào phù hợp</div>
        ) : (
          <table className="tk-table">
            <thead>
              <tr>
                <th>Tên đăng nhập</th>
                <th>Vai trò</th>
                <th>Liên kết</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(tk => (
                <tr key={tk.idUser}>
                  <td>
                    <div className="tk-user-info">
                      <div className="tk-avatar">{tk.tenNguoiDung.charAt(0).toUpperCase()}</div>
                      <div>
                        <span className="tk-user-name">{tk.tenNguoiDung}</span>
                        <span className="tk-user-id">#{tk.idUser}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="tk-activity-info" style={{ fontWeight: 600, color: '#004f9f' }}>
                      <ShieldCheck size={14} /> {tk.vaiTro?.tenVaiTro || '—'}
                    </div>
                  </td>
                  <td>
                    {tk.doanVien && <div className="tk-activity-info"><Building size={14} /> {tk.doanVien.hoTen}</div>}
                    {tk.khoaTK && <div className="tk-activity-info"><Building size={14} /> {tk.khoaTK.tenKhoa}</div>}
                    {!tk.doanVien && !tk.khoaTK && <span style={{ color: '#94a3b8' }}>—</span>}
                  </td>
                  <td>
                    <div className="tk-activity-info">
                      {tk.ngayTao ? new Date(tk.ngayTao).toLocaleDateString('vi-VN') : '—'}
                    </div>
                  </td>
                  <td>
                    <span className={`tk-badge ${tk.trangThai ? 'tk-badge--active' : 'tk-badge--locked'}`}>
                      <Circle size={8} fill="currentColor" />
                      {tk.trangThai ? 'Đang hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="tk-btn-icon" title="Cập nhật" id={`btn-sua-${tk.idUser}`} onClick={() => openEdit(tk)}>
                        <Edit size={16} />
                      </button>
                      <button className="tk-btn-icon" title="Đặt lại mật khẩu" id={`btn-reset-${tk.idUser}`} onClick={() => openReset(tk)}>
                        <Key size={16} />
                      </button>
                      <button
                        className={`tk-btn-icon ${tk.trangThai ? 'tk-btn-lock' : 'tk-btn-active'}`}
                        title={tk.trangThai ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                        id={`btn-toggle-${tk.idUser}`}
                        onClick={() => handleToggleStatus(tk)}
                      >
                        {tk.trangThai ? <UserX size={16} /> : <ShieldCheck size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Phân trang ── */}
      {pagination.totalPages > 1 && (
        <div className="tk-pagination">
          <button className="tk-page-btn" disabled={pagination.page <= 1} onClick={() => fetchAccounts(pagination.page - 1)}>← Trước</button>
          <span className="tk-page-info">Trang {pagination.page} / {pagination.totalPages} ({pagination.total} tài khoản)</span>
          <button className="tk-page-btn" disabled={pagination.page >= pagination.totalPages} onClick={() => fetchAccounts(pagination.page + 1)}>Sau →</button>
        </div>
      )}

      {/* ════════ MODAL: Thêm / Cập nhật ════════ */}
      {showModal && (
        <div className="tk-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="tk-modal" onClick={e => e.stopPropagation()}>
            <div className="tk-modal-header">
              <h2>{editTarget ? 'Cập nhật tài khoản' : 'Thêm tài khoản mới'}</h2>
              <button className="tk-modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="tk-modal-body">
              {formError && <div className="tk-form-error">{formError}</div>}

              {/* Tên đăng nhập */}
              <div className="tk-form-group">
                <label className="tk-form-label">Tên đăng nhập <span className="req">*</span></label>
                <input id="input-ten-dang-nhap" className="tk-form-input" type="text"
                  placeholder="Nhập tên đăng nhập..."
                  value={form.tenNguoiDung}
                  onChange={e => setForm(f => ({ ...f, tenNguoiDung: e.target.value }))}
                />
              </div>

              {/* Mật khẩu — chỉ khi tạo mới */}
              {!editTarget && (
                <div className="tk-form-group">
                  <label className="tk-form-label">Mật khẩu <span className="req">*</span></label>
                  <input id="input-mat-khau" className="tk-form-input" type="password"
                    placeholder="Ít nhất 6 ký tự..."
                    value={form.matKhau}
                    onChange={e => setForm(f => ({ ...f, matKhau: e.target.value }))}
                  />
                </div>
              )}

              {/* Vai trò */}
              <div className="tk-form-group">
                <label className="tk-form-label">Vai trò <span className="req">*</span></label>
                <select id="select-vai-tro" className="tk-form-input"
                  value={form.idVaiTro}
                  onChange={e => setForm(f => ({ ...f, idVaiTro: e.target.value, idDV: '', idKhoa: '' }))}
                >
                  <option value="">-- Chọn vai trò --</option>
                  {vaiTroList.map(vt => (
                    <option key={vt.idVaiTro} value={vt.idVaiTro}>{vt.tenVaiTro}</option>
                  ))}
                </select>
                {/* Gợi ý theo vai trò đã chọn */}
                {form.idVaiTro && (() => {
                  const rt = getVaiTroType(form.idVaiTro, vaiTroList);
                  const hints = {
                    DOANTRUONG: '✅ Đoàn Trường — không cần liên kết Đoàn viên hay Khoa',
                    DOANKHOA:   '🏫 Đoàn Khoa — vui lòng chọn Khoa phụ trách bên dưới',
                    DOANVIEN:   '🎓 Bí thư/Đoàn viên — vui lòng nhập mã sinh viên bên dưới (tự động tạo đoàn viên nếu chưa có)',
                  };
                  return hints[rt] ? <span className="tk-dv-hint">{hints[rt]}</span> : null;
                })()}
              </div>

              {/* Field động theo vai trò */}
              {renderRoleFields()}

              <div className="tk-modal-footer">
                <button type="button" className="tk-btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="tk-btn-primary" disabled={isSubmitting} id="btn-luu-tai-khoan">
                  {isSubmitting ? <Loader size={16} className="tk-spin" /> : <Save size={16} />}
                  {editTarget ? 'Lưu thay đổi' : 'Tạo tài khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════ MODAL: Đặt lại mật khẩu ════════ */}
      {showResetModal && (
        <div className="tk-modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="tk-modal tk-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="tk-modal-header">
              <h2>Đặt lại mật khẩu</h2>
              <button className="tk-modal-close" onClick={() => setShowResetModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleResetPassword} className="tk-modal-body">
              <p className="tk-reset-note">Đặt lại mật khẩu cho: <strong>{resetTarget?.tenNguoiDung}</strong></p>
              {resetError && <div className="tk-form-error">{resetError}</div>}
              <div className="tk-form-group">
                <label className="tk-form-label">Mật khẩu mới <span className="req">*</span></label>
                <input id="input-mat-khau-moi" className="tk-form-input" type="password"
                  placeholder="Ít nhất 6 ký tự..."
                  value={resetForm.matKhauMoi}
                  onChange={e => setResetForm(f => ({ ...f, matKhauMoi: e.target.value }))}
                />
              </div>
              <div className="tk-form-group">
                <label className="tk-form-label">Xác nhận mật khẩu <span className="req">*</span></label>
                <input id="input-xac-nhan-mat-khau" className="tk-form-input" type="password"
                  placeholder="Nhập lại mật khẩu mới..."
                  value={resetForm.xacNhanMatKhau}
                  onChange={e => setResetForm(f => ({ ...f, xacNhanMatKhau: e.target.value }))}
                />
              </div>
              <div className="tk-modal-footer">
                <button type="button" className="tk-btn-secondary" onClick={() => setShowResetModal(false)}>Hủy</button>
                <button type="submit" className="tk-btn-primary" disabled={isResetting} id="btn-dat-lai-mat-khau">
                  {isResetting ? <Loader size={16} className="tk-spin" /> : <Key size={16} />}
                  Đặt lại mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaiKhoan;
