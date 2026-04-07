import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/auth/login/Login';
import DoanTruongRoutes from './DoanTruongRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Protected – mỗi role có route riêng */}
      {DoanTruongRoutes}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
