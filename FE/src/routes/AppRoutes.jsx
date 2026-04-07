import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/login/Login';
// import Dashboard from '../pages/Dashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
