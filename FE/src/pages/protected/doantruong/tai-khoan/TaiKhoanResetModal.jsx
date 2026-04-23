import { X, Key, Loader } from "lucide-react";

const TaiKhoanResetModal = ({
  show,
  resetTarget,
  resetForm,
  resetError,
  isResetting,
  onClose,
  onSubmit,
  setResetForm,
}) => {
  if (!show) return null;

  return (
    <div className="tk-modal-overlay" onClick={onClose}>
      <div
        className="tk-modal tk-modal--sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tk-modal-header">
          <h2>Đặt lại mật khẩu</h2>
          <button className="tk-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="tk-modal-body">
          <p className="tk-reset-note">
            Đặt lại mật khẩu cho: <strong>{resetTarget?.tenNguoiDung}</strong>
          </p>
          {resetError && <div className="tk-form-error">{resetError}</div>}
          <div className="tk-form-group">
            <label className="tk-form-label">
              Mật khẩu mới <span className="req">*</span>
            </label>
            <input
              id="input-mat-khau-moi"
              className="tk-form-input"
              type="password"
              placeholder="Ít nhất 6 ký tự..."
              value={resetForm.matKhauMoi}
              onChange={(e) =>
                setResetForm((f) => ({ ...f, matKhauMoi: e.target.value }))
              }
            />
          </div>
          <div className="tk-form-group">
            <label className="tk-form-label">
              Xác nhận mật khẩu <span className="req">*</span>
            </label>
            <input
              id="input-xac-nhan-mat-khau"
              className="tk-form-input"
              type="password"
              placeholder="Nhập lại mật khẩu mới..."
              value={resetForm.xacNhanMatKhau}
              onChange={(e) =>
                setResetForm((f) => ({
                  ...f,
                  xacNhanMatKhau: e.target.value,
                }))
              }
            />
          </div>
          <div className="tk-modal-footer">
            <button
              type="button"
              className="tk-btn-secondary"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="tk-btn-primary"
              disabled={isResetting}
              id="btn-dat-lai-mat-khau"
            >
              {isResetting ? (
                <Loader size={16} className="tk-spin" />
              ) : (
                <Key size={16} />
              )}
              Đặt lại mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaiKhoanResetModal;
