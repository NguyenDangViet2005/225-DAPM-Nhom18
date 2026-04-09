import { createContext, useContext, useState, useEffect } from 'react';
import { ROLE_PERMISSIONS } from '@/constants/permissions';
import { ROLES } from '@/constants/roles';

import { MOCK_USERS } from '@/data/mockUsers';

/**
 * AuthContext – lưu trạng thái đăng nhập toàn cục.
 * Sau khi tích hợp BE, thay mock bằng API call + JWT decode.
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // ── MOCK LOGIN TRONG QUÁ TRÌNH DEV ──────────────────────────
<<<<<<< HEAD
  // Để hiển thị Dashboard ngay lập tức, ta gán user mặc định từ mock data.
  const [user, setUser] = useState(MOCK_USERS.khoa);
=======
  // Để hiển thị Dashboard ngay lập tức, ta gán user mặc định.
  // Hãy đổi role sang ROLES.DOANKHOA để test giao diện cấp Khoa.
  const [user, setUser] = useState({
    name: 'Nguyễn Thị Khánh Ly',
    role: ROLES.DOANVIEN,
  });
>>>>>>> feature/DoanVien_1
  
  const [isLoading, setIsLoading] = useState(true);

  // Restore session từ localStorage khi reload
  useEffect(() => {
    try {
      const stored = localStorage.getItem('auth_user');
      if (stored) setUser(JSON.parse(stored));
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * login – gọi sau khi nhận response thành công từ API
   * @param {{ id: string, name: string, role: string }} userData
   */
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const permissions = ROLE_PERMISSIONS[user?.role] ?? [];

  return (
    <AuthContext.Provider value={{ user, permissions, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// helper hook – dùng thay vì import AuthContext trực tiếp
export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;
