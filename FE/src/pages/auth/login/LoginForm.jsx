import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { loginAPI } from "@/apis/auth.api";
import { getRoleBasedRedirectPath } from "@/utils";

const LoginForm = ({ onForgotPassword }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginAPI(username, password);

      const redirectPath = getRoleBasedRedirectPath(
        response.user.type,
        response.user.laBiThu,
      );

      const userData = {
        idUser: response.user.idUser,
        tenNguoiDung: response.user.tenNguoiDung,
        type: response.user.type,
        idVaiTro: response.user.idVaiTro,
        hoTen: response.user.hoTen,
        idDV: response.user.idDV,
        idKhoa: response.user.idKhoa,
        laBiThu: response.user.laBiThu,
      };

      login(userData);

      window.location.href = redirectPath;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Lỗi kết nối đến máy chủ";
      alert(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-panel">
      <div className="login-form-wrapper">
        <div className="login-form-header">
          <div className="login-form-tagline">HỆ THỐNG NỘI BỘ</div>
          <h2 className="login-form-title">Đăng nhập</h2>
          <p className="login-form-subtitle">
            Sử dụng tài khoản được cấp bởi Ban quản trị Đoàn trường
          </p>
        </div>

        <div className="login-accent-bar" />

        <form onSubmit={handleSubmit} noValidate>
          <div className="login-field-group">
            <label className="login-label" htmlFor="username">
              Tài khoản / Mã số sinh viên
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                id="username"
                type="text"
                className="login-input"
                placeholder="Nhập mã số sinh viên..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="login-field-group">
            <label className="login-label" htmlFor="password">
              Mật khẩu
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                >
                  <rect x="3" y="11" width="18" height="11" rx="0" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="password"
                type="password"
                className="login-input"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-options-row">
            <label className="login-check-label">
              <input type="checkbox" className="login-checkbox" />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <button
              type="button"
              className="login-forgot-link"
              onClick={onForgotPassword}
            >
              Quên mật khẩu?
            </button>
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                  style={{ marginRight: "10px" }}
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                ĐĂNG NHẬP HỆ THỐNG
              </>
            )}
          </button>
        </form>
        <div className="login-security-note">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#004F9F"
            strokeWidth="2"
            strokeLinecap="square"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>
            Kết nối được mã hóa SSL • Chỉ dành cho cán bộ Đoàn và Đoàn viên được
            cấp tài khoản
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
