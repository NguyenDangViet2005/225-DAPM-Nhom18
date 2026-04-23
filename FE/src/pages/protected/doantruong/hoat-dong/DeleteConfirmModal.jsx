import { AlertTriangle } from "lucide-react";

const DeleteConfirmModal = ({
  show,
  onClose,
  onConfirm,
  activityName,
  isLoading = false,
}) => {
  if (!show) return null;

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div
        className="delete-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="delete-modal-icon">
          <AlertTriangle size={48} />
        </div>

        <h2 className="delete-modal-title">Xác nhận xóa hoạt động</h2>

        <p className="delete-modal-text">
          Bạn có chắc chắn muốn xóa hoạt động <strong>"{activityName}"</strong>?
        </p>
        <p className="delete-modal-warning">
          Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị xóa
          vĩnh viễn.
        </p>

        <div className="delete-modal-actions">
          <button
            className="delete-btn-cancel"
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy bỏ
          </button>
          <button
            className="delete-btn-confirm"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Đang xóa..." : "Xóa hoạt động"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
