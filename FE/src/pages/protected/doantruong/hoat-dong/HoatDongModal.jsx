import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { HOAT_DONG_STATUS, DON_VI_TO_CHUC } from "@/constants";

const INITIAL_FORM_STATE = {
  idHD: "",
  tenHD: "",
  moTa: "",
  ngayToChuc: "",
  diaDiem: "",
  soLuongMax: "",
  diemHD: 0,
  trangThai: HOAT_DONG_STATUS.DANG_MO,
  donViToChuc: DON_VI_TO_CHUC.DOAN_TRUONG,
};

const HoatDongModal = ({
  show,
  onClose,
  onSave,
  activity = null,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

  // Reset errors when modal closes
  const handleClose = () => {
    setErrors({});
    onClose();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!show) return;

    if (activity) {
      setFormData({
        idHD: activity.idHD || "",
        tenHD: activity.tenHD || "",
        moTa: activity.moTa || "",
        ngayToChuc: activity.ngayToChuc
          ? new Date(activity.ngayToChuc).toISOString().split("T")[0]
          : "",
        diaDiem: activity.diaDiem || "",
        soLuongMax: activity.soLuongMax || "",
        diemHD: activity.diemHD || 0,
        trangThai: activity.trangThai?.trim() || HOAT_DONG_STATUS.DANG_MO,
        donViToChuc:
          activity.donViToChuc?.trim() || DON_VI_TO_CHUC.DOAN_TRUONG,
      });
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
  }, [show, activity]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape" && show) handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [show]);

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = {
      idHD: "Mã hoạt động không được để trống",
      tenHD: "Tên hoạt động không được để trống",
      ngayToChuc: "Ngày tổ chức không được để trống",
      diaDiem: "Địa điểm không được để trống",
      donViToChuc: "Đơn vị tổ chức không được để trống",
    };

    Object.keys(requiredFields).forEach((field) => {
      if (!formData[field]?.toString().trim()) {
        newErrors[field] = requiredFields[field];
      }
    });

    const maxQty = Number(formData.soLuongMax);
    if (!formData.soLuongMax || isNaN(maxQty) || maxQty <= 0) {
      newErrors.soLuongMax = "Số lượng tối đa phải là số dương lớn hơn 0";
    }

    const points = Number(formData.diemHD);
    if (isNaN(points) || points < 0) {
      newErrors.diemHD = "Điểm hoạt động không được nhỏ hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Auto-convert number inputs to real numbers
    const processedValue =
      type === "number" ? (value === "" ? "" : Number(value)) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal-overlay"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {activity ? "Chỉnh sửa hoạt động" : "Tạo hoạt động mới"}
          </h2>
          <button
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Đóng"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mã hoạt động *</label>
              <input
                type="text"
                name="idHD"
                value={formData.idHD}
                onChange={handleChange}
                placeholder="VD: HD001"
                className={`form-input ${errors.idHD ? "error" : ""}`}
                disabled={activity !== null}
              />
              {errors.idHD && <span className="error-text">{errors.idHD}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Đơn vị tổ chức *</label>
              <select
                name="donViToChuc"
                value={formData.donViToChuc}
                onChange={handleChange}
                className={`form-input ${errors.donViToChuc ? "error" : ""}`}
              >
                <option value={DON_VI_TO_CHUC.DOAN_TRUONG}>
                  {DON_VI_TO_CHUC.DOAN_TRUONG}
                </option>
                <option value={DON_VI_TO_CHUC.DOAN_KHOA}>
                  {DON_VI_TO_CHUC.DOAN_KHOA}
                </option>
                <option value={DON_VI_TO_CHUC.CHI_DOAN}>
                  {DON_VI_TO_CHUC.CHI_DOAN}
                </option>
              </select>
              {errors.donViToChuc && (
                <span className="error-text">{errors.donViToChuc}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tên hoạt động *</label>
            <input
              type="text"
              name="tenHD"
              value={formData.tenHD}
              onChange={handleChange}
              placeholder="VD: Ngày hội tầm gửi"
              className={`form-input ${errors.tenHD ? "error" : ""}`}
            />
            {errors.tenHD && <span className="error-text">{errors.tenHD}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea
              name="moTa"
              value={formData.moTa}
              onChange={handleChange}
              placeholder="Mô tả chi tiết về hoạt động..."
              className="form-input"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ngày tổ chức *</label>
              <input
                type="date"
                name="ngayToChuc"
                value={formData.ngayToChuc}
                onChange={handleChange}
                className={`form-input ${errors.ngayToChuc ? "error" : ""}`}
              />
              {errors.ngayToChuc && (
                <span className="error-text">{errors.ngayToChuc}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Địa điểm *</label>
              <input
                type="text"
                name="diaDiem"
                value={formData.diaDiem}
                onChange={handleChange}
                placeholder="VD: Sân trường chính"
                className={`form-input ${errors.diaDiem ? "error" : ""}`}
              />
              {errors.diaDiem && (
                <span className="error-text">{errors.diaDiem}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Số lượng tối đa *</label>
              <input
                type="number"
                name="soLuongMax"
                value={formData.soLuongMax}
                onChange={handleChange}
                placeholder="VD: 500"
                className={`form-input ${errors.soLuongMax ? "error" : ""}`}
                min="1"
              />
              {errors.soLuongMax && (
                <span className="error-text">{errors.soLuongMax}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Điểm hoạt động</label>
              <input
                type="number"
                name="diemHD"
                value={formData.diemHD}
                onChange={handleChange}
                placeholder="VD: 5"
                className={`form-input ${errors.diemHD ? "error" : ""}`}
                min="0"
              />
              {errors.diemHD && (
                <span className="error-text">{errors.diemHD}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Trạng thái đăng ký</label>
            <select
              name="trangThai"
              value={formData.trangThai}
              onChange={handleChange}
              className="form-input"
            >
              <option value={HOAT_DONG_STATUS.DANG_MO}>
                {HOAT_DONG_STATUS.DANG_MO}
              </option>
              <option value={HOAT_DONG_STATUS.DA_DONG}>
                {HOAT_DONG_STATUS.DA_DONG}
              </option>
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
              disabled={isLoading}
            >
              Hủy bỏ
            </button>
            <button type="submit" className="btn-save" disabled={isLoading}>
              {isLoading
                ? "Đang lưu..."
                : activity
                  ? "Cập nhật"
                  : "Tạo hoạt động"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HoatDongModal;
