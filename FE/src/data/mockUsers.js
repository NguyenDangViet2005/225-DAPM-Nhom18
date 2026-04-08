import { ROLES } from '@/constants/roles';

export const MOCK_USERS = {
  admin: {
    id: 'U001',
    username: 'admin',
    password: '123',
    name: 'Ban Thường vụ Đoàn trường',
    role: ROLES.DOANTRUONG,
    email: 'doantruong@hcmute.edu.vn',
    avatar: null
  },
  khoa: {
    id: 'U002',
    username: 'khoa',
    password: '123',
    name: 'Bí thư Liên chi đoàn Khoa Công nghệ Thông tin',
    role: ROLES.DOANKHOA,
    email: 'doankhoa_cntt@hcmute.edu.vn',
    avatar: null
  },
  bithu: {
    id: 'U003',
    username: 'bithu',
    password: '123',
    name: 'Nguyễn Văn Bí Thư (Lớp 21110CL1)',
    role: ROLES.BITHU,
    email: 'bithu_21110cl1@student.hcmute.edu.vn',
    avatar: null
  },
  doanvien: {
    id: 'U004',
    username: 'sv01',
    password: '123',
    name: 'Lê Văn Đoàn Viên',
    role: ROLES.DOANVIEN,
    email: '21110123@student.hcmute.edu.vn',
    avatar: null
  }
};

export const getAllMockUsers = () => Object.values(MOCK_USERS);
export const getMockUserByUsername = (username) => MOCK_USERS[username] || null;
