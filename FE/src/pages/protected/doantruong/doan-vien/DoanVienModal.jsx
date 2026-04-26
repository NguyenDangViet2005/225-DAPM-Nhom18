import { useState } from "react";

const Field = ({ label, required, children }) => (
  <div className="ql-dv-field">
    <label className="ql-dv-label">
      {label} {required && <span style={{ color: "red" }}>*</span>}
    </label>
    {children}
  </div>
);

const DoanVienModal = ({
  show,
  isEdit,
  form = {},
  chiDoanList = [],
  onClose,
  onSubmit,
  onChange,
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
            <Field label="Mã đoàn viên (MSSV)" required>
              <input
                required
                disabled={isEdit}
                type="text"
                placeholder="VD: 23115053122249"
                value={form.idDV || ""}
                onChange={(e) => onChange({ ...form, idDV: e.target.value })}
                className="ql-dv-form-input"
              />
            </Field>

            <Field label="Họ và tên" required>
              <input
                required
                type="text"
                placeholder="VD: Nguyễn Văn A"
                value={form.hoTen || ""}
                onChange={(e) => onChange({ ...form, hoTen: e.target.value })}
                className="ql-dv-form-input"
              />
            </Field>

            <div className="ql-dv-form-row">
              <Field label="Giới tính">
                <select
                  value={form.gioiTinh || "Nam"}
                  onChange={(e) => onChange({ ...form, gioiTinh: e.target.value })}
                  className="ql-dv-form-input"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </Field>
              <Field label="Ngày sinh">
                <input
                  type="date"
                  value={form.ngaySinh || ""}
                  onChange={(e) => onChange({ ...form, ngaySinh: e.target.value })}
                  className="ql-dv-form-input"
                />
              </Field>
            </div>

            <div className="ql-dv-form-row">
              <Field label="Số điện thoại">
                <input
                  type="text"
                  placeholder="VD: 0905507622"
                  value={form.SDT || ""}
                  onChange={(e) => onChange({ ...form, SDT: e.target.value })}
                  className="ql-dv-form-input"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  placeholder="VD: abc@gmail.com"
                  value={form.email || ""}
                  onChange={(e) => onChange({ ...form, email: e.target.value })}
                  className="ql-dv-form-input"
                />
              </Field>
            </div>

            <div className="ql-dv-form-row">
              <Field label="Số CCCD">
                <input
                  type="text"
                  placeholder="VD: 079205012345"
                  value={form.CCCD || ""}
                  onChange={(e) => onChange({ ...form, CCCD: e.target.value })}
                  className="ql-dv-form-input"
                />
              </Field>
              <Field label="Ngày cấp CCCD">
                <input
                  type="date"
                  value={form.ngayCapCCCD || ""}
                  onChange={(e) => onChange({ ...form, ngayCapCCCD: e.target.value })}
                  className="ql-dv-form-input"
                />
              </Field>
            </div>

            <Field label="Nơi cấp CCCD">
              <input
                type="text"
                placeholder="VD: Cục Cảnh sát QLHC về TTXH"
                value={form.noiCapCCCD || ""}
                onChange={(e) => onChange({ ...form, noiCapCCCD: e.target.value })}
                className="ql-dv-form-input"
              />
            </Field>

            <Field label="Địa chỉ thường trú">
              <input
                type="text"
                placeholder="VD: 789 Hùng Vương, Thanh Khê, Đà Nẵng"
                value={form.diaChiThuongTru || ""}
                onChange={(e) => onChange({ ...form, diaChiThuongTru: e.target.value })}
                className="ql-dv-form-input"
              />
            </Field>

            <Field label="Địa chỉ tạm trú">
              <input
                type="text"
                placeholder="VD: 123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng"
                value={form.diaChiTamTru || ""}
                onChange={(e) => onChange({ ...form, diaChiTamTru: e.target.value })}
                className="ql-dv-form-input"
              />
            </Field>

            <div className="ql-dv-form-row">
              <Field label="Dân tộc">
                <input
                  type="text"
                  placeholder="VD: Kinh"
                  value={form.danToc || ""}
                  onChange={(e) => onChange({ ...form, danToc: e.target.value })}
                  className="ql-dv-form-input"
                />
              </Field>
              <Field label="Tôn giáo">
                <input
                  type="text"
                  placeholder="VD: Không"
                  value={form.tonGiao || ""}
                  onChange={(e) => onChange({ ...form, tonGiao: e.target.value })}
                  className="ql-dv-form-input"
                />
              </Field>
            </div>

            <div className="ql-dv-form-row">
              <Field label="Hệ đào tạo">
                <input
                  type="text"
                  placeholder="VD: Chính quy"
                  value={form.heDaoTao || ""}
                  onChange={(e) => onChange({ ...form, heDaoTao: e.target.value })}
                  className="ql-dv-form-input"
                />
              </Field>
              <Field label="Trạng thái học">
                <select
                  value={form.trangThaiHoc || "Đang học"}
                  onChange={(e) => onChange({ ...form, trangThaiHoc: e.target.value })}
                  className="ql-dv-form-input"
                >
                  <option value="Đang học">Đang học</option>
                  <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                  <option value="Bảo lưu">Bảo lưu</option>
                  <option value="Thôi học">Thôi học</option>
                </select>
              </Field>
            </div>

            <Field label="Chi đoàn (lớp)">
              <select
                value={(form.idChiDoan || "").trim()}
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
            </Field>
          </div>

          <div className="ql-dv-modal-footer">
            <button type="button" className="ql-dv-btn-secondary" onClick={onClose}>
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
