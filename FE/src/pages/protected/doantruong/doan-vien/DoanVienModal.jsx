const DoanVienModal = ({ 
  show, 
  isEdit, 
  form, 
  chiDoanList, 
  onClose, 
  onSubmit, 
  onChange 
}) => {
  if (!show) return null;

  return (
    <div className="ql-dv-modal-overlay" onClick={onClose}>
      <div className="ql-dv-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="ql-dv-modal-title">
          {isEdit ? "Cập nhật thông tin" : "Thêm đoàn viên mới"}
        </h3>
        <form onSubmit={onSubmit}>
          <div className="ql-dv-form-group">
            <input
              required
              disabled={isEdit}
              type="text"
              placeholder="Mã đoàn viên (MSSV) *"
              value={form.idDV}
              onChange={(e) => onChange({ ...form, idDV: e.target.value })}
              className="ql-dv-form-input"
            />
            <input
              required
              type="text"
              placeholder="Họ và tên *"
              value={form.hoTen}
              onChange={(e) => onChange({ ...form, hoTen: e.target.value })}
              className="ql-dv-form-input"
            />

            <div className="ql-dv-form-row">
              <select
                value={form.gioiTinh}
                onChange={(e) => onChange({ ...form, gioiTinh: e.target.value })}
                className="ql-dv-form-input"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
              <input
                type="date"
                placeholder="Ngày sinh"
                value={form.ngaySinh}
                onChange={(e) => onChange({ ...form, ngaySinh: e.target.value })}
                className="ql-dv-form-input"
              />
            </div>

            <input
              type="text"
              placeholder="Số điện thoại"
              value={form.SDT}
              onChange={(e) => onChange({ ...form, SDT: e.target.value })}
              className="ql-dv-form-input"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => onChange({ ...form, email: e.target.value })}
              className="ql-dv-form-input"
            />

            <select
              value={form.idChiDoan.trim()}
              onChange={(e) => onChange({ ...form, idChiDoan: e.target.value })}
              className="ql-dv-form-input"
            >
              <option value="">-- Chọn chi đoàn (lớp) --</option>
              {chiDoanList.map((cd) => (
                <option key={cd.idChiDoan} value={cd.idChiDoan.trim()}>
                  {cd.tenChiDoan} {cd.khoa && `- ${cd.khoa.tenKhoa}`}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Địa chỉ thường trú"
              value={form.diaChi}
              onChange={(e) => onChange({ ...form, diaChi: e.target.value })}
              className="ql-dv-form-input"
            />
          </div>

          <div className="ql-dv-modal-footer">
            <button
              type="button"
              className="ql-dv-btn-secondary"
              onClick={onClose}
            >
              Hủy
            </button>
            <button type="submit" className="ql-dv-btn-save">
              {isEdit ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoanVienModal;
