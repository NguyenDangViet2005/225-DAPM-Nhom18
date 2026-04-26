import { useState } from "react";
import { getProvinces, getWardsByProvince, formatAddress, parseAddress } from "../../../../utils/address.util";

const Field = ({ label, required, children }) => (
  <div className="ql-dv-field">
    <label className="ql-dv-label">
      {label} {required && <span style={{ color: "red" }}>*</span>}
    </label>
    {children}
  </div>
);

const AddressField = ({ label, value, isEdit, onChange }) => {
  const [isEditing, setIsEditing] = useState(!isEdit);
  const [addressParts, setAddressParts] = useState({ duong: '', quan: '', tinh: '' });
  const [wards, setWards] = useState([]);

  const provinces = getProvinces();

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    const newWards = getWardsByProvince(selectedProvince);
    setWards(newWards);
    const newParts = { ...addressParts, tinh: selectedProvince, quan: '' };
    setAddressParts(newParts);
    
    // Tự động cập nhật khi tạo mới
    if (!isEdit) {
      const fullAddress = formatAddress(newParts.duong, newParts.quan, newParts.tinh);
      onChange(fullAddress);
    }
  };

  const handleWardChange = (e) => {
    const newParts = { ...addressParts, quan: e.target.value };
    setAddressParts(newParts);
    
    // Tự động cập nhật khi tạo mới
    if (!isEdit) {
      const fullAddress = formatAddress(newParts.duong, newParts.quan, newParts.tinh);
      onChange(fullAddress);
    }
  };

  const handleStreetChange = (e) => {
    const newParts = { ...addressParts, duong: e.target.value };
    setAddressParts(newParts);
    
    // Tự động cập nhật khi tạo mới
    if (!isEdit) {
      const fullAddress = formatAddress(newParts.duong, newParts.quan, newParts.tinh);
      onChange(fullAddress);
    }
  };

  const handleSave = () => {
    const fullAddress = formatAddress(addressParts.duong, addressParts.quan, addressParts.tinh);
    onChange(fullAddress);
    setIsEditing(false);
  };

  const handleEdit = () => {
    // Reset về trạng thái rỗng khi bấm chỉnh sửa
    setAddressParts({ duong: '', quan: '', tinh: '' });
    setWards([]);
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Hủy và trở về trạng thái hiển thị ban đầu
    setIsEditing(false);
    setAddressParts({ duong: '', quan: '', tinh: '' });
    setWards([]);
  };

  if (isEditing) {
    return (
      <Field label={label}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <select
            value={addressParts.tinh || ''}
            onChange={handleProvinceChange}
            className="ql-dv-form-input"
          >
            <option value="">-- Chọn Tỉnh/Thành phố --</option>
            {provinces.map((province) => (
              <option key={province.province_code} value={province.name}>
                {province.name}
              </option>
            ))}
          </select>

          <select
            value={addressParts.quan || ''}
            onChange={handleWardChange}
            className="ql-dv-form-input"
            disabled={!addressParts.tinh}
          >
            <option value="">-- Chọn Phường/Xã --</option>
            {wards.map((ward) => (
              <option key={ward.ward_code} value={ward.name}>
                {ward.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Nhập số nhà, tên đường (VD: 123 Nguyễn Văn Linh)"
            value={addressParts.duong || ''}
            onChange={handleStreetChange}
            className="ql-dv-form-input"
          />

          {isEdit && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={handleCancel}
                className="ql-dv-btn-secondary"
                style={{ padding: '6px 12px', fontSize: '14px', flex: 1 }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="ql-dv-btn-save"
                style={{ padding: '6px 12px', fontSize: '14px', flex: 1 }}
              >
                Lưu địa chỉ
              </button>
            </div>
          )}
        </div>
      </Field>
    );
  }

  return (
    <Field label={label}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          value={value || ''}
          readOnly
          className="ql-dv-form-input"
          style={{ flex: 1 }}
        />
        {isEdit && (
          <button
            type="button"
            onClick={handleEdit}
            className="ql-dv-btn-secondary"
            style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}
          >
            Chỉnh sửa
          </button>
        )}
      </div>
    </Field>
  );
};

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

            <AddressField
              label="Địa chỉ thường trú"
              value={form.diaChiThuongTru || ""}
              isEdit={isEdit}
              onChange={(newAddress) => onChange({ ...form, diaChiThuongTru: newAddress })}
            />

            <AddressField
              label="Địa chỉ tạm trú"
              value={form.diaChiTamTru || ""}
              isEdit={isEdit}
              onChange={(newAddress) => onChange({ ...form, diaChiTamTru: newAddress })}
            />

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
