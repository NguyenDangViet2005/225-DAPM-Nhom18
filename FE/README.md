# Frontend - Coding Standards & Project Structure

## 📋 Tổng quan

Dự án Frontend sử dụng **React 19** với **Vite** build tool. Dự án tuân theo kiến trúc **Feature-based** kết hợp với **Clean Architecture** và nguyên tắc **Component-Driven Development**.

## 🏗️ Cấu trúc dự án

```
FE/
├── public/              # Static assets
├── src/
│   ├── apis/           # API service layer (axios instances, endpoints)
│   ├── assets/         # Images, fonts, icons
│   ├── components/     # Shared/reusable components
│   ├── contexts/       # React Context providers
│   ├── data/           # Static data, mock data, constants
│   ├── features/       # Feature-based modules
│   ├── helpers/        # Helper functions (có side effects)
│   ├── hooks/          # Custom React hooks
│   ├── libs/           # Third-party library configs
│   ├── pages/          # Page components (routes)
│   ├── utils/          # Pure utility functions
│   ├── App.jsx         # Root component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## 🔄 Luồng xử lý dữ liệu (Data Flow)

```
User Interaction → Page → Feature Component → Custom Hook → API Service → Backend
                     ↓                                          ↓
                  Context                                   Response
                     ↓                                          ↓
                Components ← State Update ← Hook ← API Service
```

### Chi tiết từng tầng:

1. **Pages** (`src/pages/`)
   - Đại diện cho các route/màn hình
   - Layout và composition của features
   - Không chứa business logic phức tạp
   - Sử dụng features và components

2. **Features** (`src/features/`)
   - Module độc lập theo tính năng
   - Chứa components, hooks, utils riêng của feature
   - Có thể tái sử dụng trong nhiều pages
   - VD: `features/DoanVien/`, `features/HoatDongDoan/`

3. **Components** (`src/components/`)
   - Shared components dùng chung
   - Reusable, không phụ thuộc business logic
   - VD: Button, Input, Modal, Table, Card

4. **Hooks** (`src/hooks/`)
   - Custom React hooks
   - Logic tái sử dụng (state, effects, API calls)
   - VD: useAuth, useFetch, useDebounce

5. **APIs** (`src/apis/`)
   - Axios instances và configurations
   - API endpoint definitions
   - Request/Response interceptors

6. **Contexts** (`src/contexts/`)
   - React Context providers
   - Global state management
   - VD: AuthContext, ThemeContext

7. **Utils** (`src/utils/`)
   - Pure functions
   - Không có side effects
   - VD: formatDate, validateEmail, calculateAge

8. **Helpers** (`src/helpers/`)
   - Helper functions có side effects
   - VD: localStorage, sessionStorage, cookies

9. **Data** (`src/data/`)
   - Static data, constants
   - Mock data cho development
   - Enums, configurations

10. **Libs** (`src/libs/`)
    - Third-party library configurations
    - VD: axios config, i18n config

## 📝 Quy tắc đặt tên file (File Naming Convention)

### 1. Components (React)
```
PascalCase.jsx
```
Ví dụ:
- `Button.jsx`
- `DoanVienCard.jsx`
- `HoatDongDoanTable.jsx`
- `LoginForm.jsx`

### 2. Pages
```
PascalCase.jsx hoặc PascalCasePage.jsx
```
Ví dụ:
- `HomePage.jsx` hoặc `Home.jsx`
- `DoanVienPage.jsx` hoặc `DoanVien.jsx`
- `LoginPage.jsx` hoặc `Login.jsx`

### 3. Hooks
```
use<Name>.jsx hoặc use<Name>.js
```
Ví dụ:
- `useAuth.js`
- `useFetch.js`
- `useDoanVien.js`
- `useDebounce.js`

### 4. Contexts
```
<Name>Context.jsx
```
Ví dụ:
- `AuthContext.jsx`
- `ThemeContext.jsx`
- `DoanVienContext.jsx`

### 5. APIs
```
<entity>.api.js hoặc <entity>Api.js
```
Ví dụ:
- `doanvien.api.js`
- `hoatdongdoan.api.js`
- `auth.api.js`

### 6. Utils
```
<purpose>.util.js hoặc <purpose>.js
```
Ví dụ:
- `date.util.js`
- `string.util.js`
- `validation.util.js`

### 7. Helpers
```
<purpose>.helper.js hoặc <purpose>.js
```
Ví dụ:
- `storage.helper.js`
- `cookie.helper.js`
- `token.helper.js`

### 8. Data/Constants
```
<name>.data.js hoặc <name>.constant.js
```
Ví dụ:
- `roles.constant.js`
- `status.constant.js`
- `mockDoanVien.data.js`

### 9. Styles (nếu dùng CSS modules)
```
<ComponentName>.module.css
```
Ví dụ:
- `Button.module.css`
- `DoanVienCard.module.css`

## 💻 Quy tắc viết code

### 1. Pages (`src/pages/<PageName>.jsx`)

```jsx
import { useState, useEffect } from 'react';
import DoanVienList from '../features/DoanVien/DoanVienList';
import DoanVienFilter from '../features/DoanVien/DoanVienFilter';
import { useDoanVien } from '../hooks/useDoanVien';

const DoanVienPage = () => {
  const { 
    doanviens, 
    loading, 
    error, 
    fetchDoanViens,
    deleteDoanVien 
  } = useDoanVien();

  const [filters, setFilters] = useState({
    search: '',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    fetchDoanViens(filters);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      await deleteDoanVien(id);
      fetchDoanViens(filters);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="doanvien-page">
      <h1>Quản lý Đoàn viên</h1>
      <DoanVienFilter 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />
      <DoanVienList 
        doanviens={doanviens} 
        onDelete={handleDelete}
      />
    </div>
  );
};

export default DoanVienPage;
```

### 2. Feature Components (`src/features/<FeatureName>/<ComponentName>.jsx`)

```jsx
import { useState } from 'react';
import Button from '../../components/Button';
import './DoanVienCard.css';

const DoanVienCard = ({ doanvien, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="doanvien-card">
      <div className="doanvien-card__header">
        <h3>{doanvien.hoTen}</h3>
        <span className="doanvien-card__id">{doanvien.idDV}</span>
      </div>

      <div className="doanvien-card__body">
        <p><strong>Email:</strong> {doanvien.email}</p>
        <p><strong>SĐT:</strong> {doanvien.SDT}</p>
        <p><strong>Chi đoàn:</strong> {doanvien.tenChiDoan}</p>

        {isExpanded && (
          <div className="doanvien-card__details">
            <p><strong>Ngày sinh:</strong> {doanvien.ngaySinh}</p>
            <p><strong>Giới tính:</strong> {doanvien.gioiTinh}</p>
            <p><strong>Địa chỉ:</strong> {doanvien.diaChi}</p>
          </div>
        )}
      </div>

      <div className="doanvien-card__actions">
        <Button variant="secondary" onClick={handleToggle}>
          {isExpanded ? 'Thu gọn' : 'Xem thêm'}
        </Button>
        <Button variant="primary" onClick={() => onEdit(doanvien.idDV)}>
          Sửa
        </Button>
        <Button variant="danger" onClick={() => onDelete(doanvien.idDV)}>
          Xóa
        </Button>
      </div>
    </div>
  );
};

export default DoanVienCard;
```

### 3. Shared Components (`src/components/<ComponentName>.jsx`)

```jsx
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const className = `btn btn--${variant} btn--${size}`;

  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

### 4. Custom Hooks (`src/hooks/use<Name>.js`)

```javascript
import { useState, useCallback } from 'react';
import { doanvienApi } from '../apis/doanvien.api';

export const useDoanVien = () => {
  const [doanviens, setDoanViens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDoanViens = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await doanvienApi.getAll(filters);
      
      if (response.success) {
        setDoanViens(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }, []);

  const getDoanVienById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await doanvienApi.getById(id);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createDoanVien = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await doanvienApi.create(data);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDoanVien = useCallback(async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await doanvienApi.update(id, data);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDoanVien = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await doanvienApi.delete(id);
      
      if (!response.success) {
        setError(response.message);
        return false;
      }
      return true;
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    doanviens,
    loading,
    error,
    fetchDoanViens,
    getDoanVienById,
    createDoanVien,
    updateDoanVien,
    deleteDoanVien
  };
};
```

### 5. API Services (`src/apis/<entity>.api.js`)

```javascript
import axiosInstance from './axios.config';

export const doanvienApi = {
  // GET all with filters
  getAll: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/doanvien', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // GET by ID
  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/doanvien/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // POST create
  create: async (data) => {
    try {
      const response = await axiosInstance.post('/doanvien', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // PUT update
  update: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/doanvien/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // DELETE
  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/doanvien/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
```

### 6. Axios Config (`src/apis/axios.config.js`)

```javascript
import axios from 'axios';
import { getToken, removeToken } from '../helpers/storage.helper';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### 7. Context (`src/contexts/<Name>Context.jsx`)

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../apis/auth.api';
import { getToken, setToken, removeToken } from '../helpers/storage.helper';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = getToken();
      if (token) {
        const response = await authApi.getProfile();
        if (response.success) {
          setUser(response.data);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      if (response.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### 8. Utils (`src/utils/<purpose>.util.js`)

```javascript
// date.util.js
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year);
};

export const calculateAge = (birthDate) => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};
```

```javascript
// validation.util.js
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^[0-9]{10,11}$/;
  return regex.test(phone);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
};

export const validateLength = (value, min, max) => {
  const length = value?.length || 0;
  return length >= min && length <= max;
};
```

### 9. Helpers (`src/helpers/<purpose>.helper.js`)

```javascript
// storage.helper.js
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const clearStorage = () => {
  localStorage.clear();
};
```

### 10. Constants (`src/data/<name>.constant.js`)

```javascript
// roles.constant.js
export const ROLES = {
  DOANTRUONG: 'Đoàn trường (Ban thường vụ)',
  DOANKHOA: 'Bí thư liên chi đoàn (Khoa)',
  BITHU: 'Bí thư chi đoàn (Lớp)',
  DOANVIEN: 'Đoàn viên (Sinh viên)'
};

export const ROLE_PERMISSIONS = {
  [ROLES.DOANTRUONG]: ['all'],
  [ROLES.DOANKHOA]: ['manage_faculty_activities', 'view_reports'],
  [ROLES.BITHU]: ['manage_class_activities', 'view_class_members'],
  [ROLES.DOANVIEN]: ['view_profile', 'register_activities']
};
```

```javascript
// status.constant.js
export const DOAN_VIEN_STATUS = {
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Ngừng hoạt động',
  TRANSFERRED: 'Đã chuyển đi'
};

export const HOAT_DONG_STATUS = {
  DRAFT: 'Nháp',
  OPEN: 'Đang mở',
  CLOSED: 'Đã đóng',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy'
};

export const DANG_KI_STATUS = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối'
};
```

## 🎯 Nguyên tắc Clean Code

### 1. Component Design
- Mỗi component chỉ làm 1 việc
- Props rõ ràng, có PropTypes hoặc TypeScript
- Tách logic ra hooks
- Tái sử dụng tối đa

### 2. State Management
- Local state cho UI state
- Context cho global state
- Custom hooks cho business logic
- Tránh prop drilling

### 3. Performance
- Sử dụng React.memo cho components nặng
- useCallback cho functions truyền vào props
- useMemo cho computed values
- Lazy loading cho routes và components

### 4. Naming Convention
- PascalCase: Components, Pages
- camelCase: functions, variables, hooks
- UPPER_CASE: Constants
- Tên file theo tên component

### 5. File Organization
```
features/DoanVien/
├── components/
│   ├── DoanVienCard.jsx
│   ├── DoanVienForm.jsx
│   └── DoanVienTable.jsx
├── hooks/
│   └── useDoanVien.js
├── utils/
│   └── doanvien.util.js
└── index.js (export all)
```

### 6. Import Order
```javascript
// 1. React imports
import { useState, useEffect } from 'react';

// 2. Third-party imports
import axios from 'axios';

// 3. Internal imports - absolute
import Button from '@/components/Button';

// 4. Internal imports - relative
import { useDoanVien } from '../hooks/useDoanVien';
import './styles.css';
```

### 7. Error Handling
```javascript
try {
  const response = await api.getData();
  // handle success
} catch (error) {
  console.error('Error:', error);
  // show user-friendly message
  setError('Có lỗi xảy ra, vui lòng thử lại');
}
```

## 📦 Dependencies chính

- **react**: UI library
- **react-dom**: React DOM renderer
- **vite**: Build tool
- **axios**: HTTP client (cần cài thêm)
- **react-router-dom**: Routing (cần cài thêm)

## 🚀 Cách thêm feature mới

1. Tạo folder feature: `src/features/<FeatureName>/`
2. Tạo components trong feature
3. Tạo custom hook: `src/hooks/use<FeatureName>.js`
4. Tạo API service: `src/apis/<entity>.api.js`
5. Tạo page: `src/pages/<FeatureName>Page.jsx`
6. Thêm route vào router
7. Test UI và functionality

## ✅ Checklist khi code

- [ ] File đặt tên đúng convention
- [ ] Component nhỏ, tập trung, dễ test
- [ ] Logic tách ra hooks
- [ ] Props có validation
- [ ] Error handling đầy đủ
- [ ] Loading states
- [ ] Responsive design
- [ ] Accessibility (a11y)
- [ ] Code clean, dễ đọc
- [ ] No console.log trong production
- [ ] Optimize performance (memo, callback)
