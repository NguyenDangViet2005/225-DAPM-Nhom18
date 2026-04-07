import { useState } from 'react';

const ForgotPasswordForm = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1400);
  };

  return (
    <div className="login-panel">
      <div className="login-form-wrapper">
        <div className="login-form-header">
          <div className="login-form-tagline">KHÔI PHỤC TÀI KHOẢN</div>
          <h2 className="login-form-title">Quên mật khẩu?</h2>
          <p className="login-form-subtitle">
            Nhập email hoặc mã số sinh viên của bạn. Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
          </p>
        </div>

        <div className="login-accent-bar" />

        {isSent ? (
          <div className="forgot-success">
            <div className="forgot-success__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="#38a169" strokeWidth="2" strokeLinecap="square">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="forgot-success__title">Đã gửi email!</h3>
            <p className="forgot-success__desc">
              Hướng dẫn đặt lại mật khẩu đã được gửi đến <strong>{email}</strong>.
              Vui lòng kiểm tra hộp thư (kể cả thư mục Spam).
            </p>
            <button
              type="button"
              className="login-submit-btn"
              onClick={onBackToLogin}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="square"
                style={{ marginRight: '10px' }}>
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              QUAY LẠI ĐĂNG NHẬP
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>

            <div className="login-field-group">
              <label className="login-label" htmlFor="forgot-email">
                Email / Mã số sinh viên
              </label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="forgot-email"
                  type="text"
                  className="login-input"
                  placeholder="Nhập email hoặc mã số sinh viên..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="login-spinner" />
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="square"
                    style={{ marginRight: '10px' }}>
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  GỬI HƯỚNG DẪN ĐẶT LẠI
                </>
              )}
            </button>

          </form>
        )}
        {!isSent && (
          <div className="forgot-back-row">
            <button
              type="button"
              className="forgot-back-btn"
              onClick={onBackToLogin}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Quay lại đăng nhập
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPasswordForm;
