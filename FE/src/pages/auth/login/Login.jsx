import { useState } from 'react';
import './Login.css';
import LoginForm from '../../../components/commons/forms/LoginForm';
import ForgotPasswordForm from '../../../components/commons/forms/ForgotPasswordForm';

const Login = () => {
  const [view, setView] = useState('login'); // 'login' | 'forgot'

  return (
    <div className="login-wrapper">
      {/* ── LEFT PANEL – Hero Image ───────────────────────────── */}
      <div className="login-hero">
        <div className="login-hero__overlay" />
        <img
          src="/images/He-thong-chuyen-trach-doan-hoi.jpg"
          alt="UTE sinh viên tốt nghiệp"
          className="login-hero__img"
        />

        <div className="login-hero__content">
          <div className="login-hero__logo-row">
            <img src="/images/ute.png" alt="UTE Logo" className="login-hero__logo" />
          </div>

          <div className="login-hero__divider" />

          <h1 className="login-hero__title">
            HỆ THỐNG QUẢN LÝ<br />
            <span className="login-hero__title-accent">ĐOÀN VIÊN</span>
          </h1>
          <p className="login-hero__subtitle">
            Trường Đại học Sư phạm Kỹ thuật TP.Đà Nẵng
          </p>

          <div className="login-hero__badge-row">
            {['Quản lý hồ sơ', 'Theo dõi hoạt động', 'Báo cáo thống kê'].map((b) => (
              <span key={b} className="login-hero__badge">{b}</span>
            ))}
          </div>
        </div>

        <div className="login-hero__footer">
          <span className="login-hero__footer-text">
            © 2026 UTE – Ban Chấp hành Đoàn trường
          </span>
        </div>
      </div>

      {/* ── RIGHT PANEL – Toggle giữa Login / Forgot Password ─── */}
      {view === 'login' ? (
        <LoginForm onForgotPassword={() => setView('forgot')} />
      ) : (
        <ForgotPasswordForm onBackToLogin={() => setView('login')} />
      )}
    </div>
  );
};

export default Login;
