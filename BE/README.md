# Backend - Coding Standards & Project Structure

## 📋 Tổng quan

Dự án Backend sử dụng kiến trúc **Layered Architecture** với Node.js, Express, và SQL Server. Dự án tuân theo nguyên tắc **Clean Code** và **Separation of Concerns**.

## 🏗️ Cấu trúc dự án

```
BE/
├── src/
│   ├── configs/         # Cấu hình (database, env, constants)
│   ├── models/          # Database models & queries
│   ├── validators/      # Request validation schemas
│   ├── middlewares/     # Express middlewares (auth, error handling)
│   ├── services/        # Business logic layer
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes definition
│   ├── helpers/         # Helper functions (reusable utilities)
│   ├── utils/           # Utility functions (pure functions)
│   └── server.js        # Entry point
├── database.sql         # Database schema
└── package.json
```

## 🔄 Luồng xử lý request (Request Flow)

```
Request → Routes → Middlewares → Validators → Controllers → Services → Models → Database
                                                    ↓
Response ← Controllers ← Services ← Models ← Database
```

### Chi tiết từng tầng:

1. **Routes** (`src/routes/`)
   - Định nghĩa các endpoint API
   - Gắn middleware và controller tương ứng
   - Không chứa logic xử lý

2. **Middlewares** (`src/middlewares/`)
   - Authentication & Authorization
   - Error handling
   - Request logging
   - Rate limiting

3. **Validators** (`src/validators/`)
   - Validate input data (express-validator)
   - Sanitize data
   - Return validation errors

4. **Controllers** (`src/controllers/`)
   - Nhận request từ routes
   - Gọi validators
   - Gọi services để xử lý logic
   - Format response và trả về client
   - Xử lý errors

5. **Services** (`src/services/`)
   - Chứa toàn bộ business logic
   - Xử lý các nghiệp vụ phức tạp
   - Gọi models để tương tác database
   - Có thể gọi nhiều models khác nhau
   - Xử lý transactions

6. **Models** (`src/models/`)
   - Định nghĩa schema và relationships (ORM models)
   - Tương tác với database thông qua ORM
   - CRUD operations
   - Không chứa business logic

7. **Helpers** (`src/helpers/`)
   - Các hàm hỗ trợ có thể tái sử dụng
   - Có thể có side effects
   - VD: sendEmail, uploadFile, generatePDF

8. **Utils** (`src/utils/`)
   - Pure functions
   - Không có side effects
   - VD: formatDate, calculateAge, generateId

9. **Configs** (`src/configs/`)
   - Database connection
   - Environment variables
   - Constants & enums

## 📝 Quy tắc đặt tên file (File Naming Convention)

### 1. Routes
```
<entity>.route.js
```
Ví dụ:
- `doanvien.route.js`
- `hoatdongdoan.route.js`
- `auth.route.js`
- `doanphi.route.js`

### 2. Controllers
```
<entity>.controller.js
```
Ví dụ:
- `doanvien.controller.js`
- `hoatdongdoan.controller.js`
- `auth.controller.js`

### 3. Services
```
<entity>.service.js
```
Ví dụ:
- `doanvien.service.js`
- `hoatdongdoan.service.js`
- `auth.service.js`

### 4. Models
```
<entity>.model.js
```
Ví dụ:
- `doanvien.model.js`
- `hoatdongdoan.model.js`
- `taikhoan.model.js`

### 5. Validators
```
<entity>.validator.js
```
Ví dụ:
- `doanvien.validator.js`
- `hoatdongdoan.validator.js`

### 6. Middlewares
```
<purpose>.middleware.js
```
Ví dụ:
- `auth.middleware.js`
- `errorHandler.middleware.js`
- `validation.middleware.js`

### 7. Helpers
```
<purpose>.helper.js
```
Ví dụ:
- `email.helper.js`
- `upload.helper.js`
- `pdf.helper.js`

### 8. Utils
```
<purpose>.util.js
```
Ví dụ:
- `date.util.js`
- `string.util.js`
- `id.util.js`

### 9. Configs
```
<purpose>.config.js
```
Ví dụ:
- `database.config.js`
- `jwt.config.js`
- `constants.config.js`

## 💻 Quy tắc viết code

### 1. Routes (`src/routes/<entity>.route.js`)

```javascript
const express = require('express');
const router = express.Router();
const doanvienController = require('../controllers/doanvien.controller');
const doanvienValidator = require('../validators/doanvien.validator');
const authMiddleware = require('../middlewares/auth.middleware');

// GET all
router.get('/', 
  authMiddleware.verifyToken,
  doanvienController.getAllDoanVien
);

// GET by ID
router.get('/:id', 
  authMiddleware.verifyToken,
  doanvienController.getDoanVienById
);

// POST create
router.post('/', 
  authMiddleware.verifyToken,
  doanvienValidator.createDoanVien,
  doanvienController.createDoanVien
);

// PUT update
router.put('/:id', 
  authMiddleware.verifyToken,
  doanvienValidator.updateDoanVien,
  doanvienController.updateDoanVien
);

// DELETE
router.delete('/:id', 
  authMiddleware.verifyToken,
  doanvienController.deleteDoanVien
);

module.exports = router;
```

### 2. Controllers (`src/controllers/<entity>.controller.js`)

```javascript
const doanvienService = require('../services/doanvien.service');
const { validationResult } = require('express-validator');

class DoanVienController {
  // GET all
  async getAllDoanVien(req, res, next) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const result = await doanvienService.getAllDoanVien(page, limit, search);
      
      return res.status(200).json({
        success: true,
        message: 'Lấy danh sách đoàn viên thành công',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // GET by ID
  async getDoanVienById(req, res, next) {
    try {
      const { id } = req.params;
      const doanvien = await doanvienService.getDoanVienById(id);
      
      if (!doanvien) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đoàn viên'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Lấy thông tin đoàn viên thành công',
        data: doanvien
      });
    } catch (error) {
      next(error);
    }
  }

  // POST create
  async createDoanVien(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: errors.array()
        });
      }

      const newDoanVien = await doanvienService.createDoanVien(req.body);
      
      return res.status(201).json({
        success: true,
        message: 'Tạo đoàn viên thành công',
        data: newDoanVien
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT update
  async updateDoanVien(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const updated = await doanvienService.updateDoanVien(id, req.body);
      
      return res.status(200).json({
        success: true,
        message: 'Cập nhật đoàn viên thành công',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE
  async deleteDoanVien(req, res, next) {
    try {
      const { id } = req.params;
      await doanvienService.deleteDoanVien(id);
      
      return res.status(200).json({
        success: true,
        message: 'Xóa đoàn viên thành công'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DoanVienController();
```

### 3. Services (`src/services/<entity>.service.js`)

```javascript
const { DoanVien, ChiDoan, Khoa, TaiKhoan } = require('../models');
const { Op } = require('sequelize');
const { generateId } = require('../utils/id.util');

class DoanVienService {
  async getAllDoanVien(page, limit, search) {
    const offset = (page - 1) * limit;
    
    const whereClause = search ? {
      [Op.or]: [
        { hoTen: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ]
    } : {};

    const { count, rows } = await DoanVien.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: ChiDoan,
          as: 'chiDoan',
          attributes: ['idChiDoan', 'tenChiDoan'],
          include: [
            {
              model: Khoa,
              as: 'khoa',
              attributes: ['idKhoa', 'tenKhoa']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['hoTen', 'ASC']]
    });
    
    return {
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async getDoanVienById(id) {
    const doanvien = await DoanVien.findByPk(id, {
      include: [
        {
          model: ChiDoan,
          as: 'chiDoan',
          include: [{ model: Khoa, as: 'khoa' }]
        },
        {
          model: TaiKhoan,
          as: 'taiKhoan',
          attributes: ['idUser', 'tenNguoiDung', 'trangThai']
        }
      ]
    });
    return doanvien;
  }

  async createDoanVien(data) {
    // Business logic: Generate ID
    const idDV = generateId('DV');
    
    // Business logic: Validate chi đoàn exists
    const chidoan = await ChiDoan.findByPk(data.idChiDoan);
    if (!chidoan) {
      throw new Error('Chi đoàn không tồn tại');
    }

    // Business logic: Check duplicate email
    const existingDV = await DoanVien.findOne({ where: { email: data.email } });
    if (existingDV) {
      throw new Error('Email đã tồn tại');
    }

    const newDoanVien = await DoanVien.create({
      idDV,
      ...data
    });

    // Fetch with relations
    return await this.getDoanVienById(newDoanVien.idDV);
  }

  async updateDoanVien(id, data) {
    // Business logic: Check exists
    const existing = await DoanVien.findByPk(id);
    if (!existing) {
      throw new Error('Đoàn viên không tồn tại');
    }

    // Business logic: Validate chi đoàn if changed
    if (data.idChiDoan && data.idChiDoan !== existing.idChiDoan) {
      const chidoan = await ChiDoan.findByPk(data.idChiDoan);
      if (!chidoan) {
        throw new Error('Chi đoàn không tồn tại');
      }
    }

    // Business logic: Check duplicate email if changed
    if (data.email && data.email !== existing.email) {
      const duplicate = await DoanVien.findOne({ 
        where: { 
          email: data.email,
          idDV: { [Op.ne]: id }
        } 
      });
      if (duplicate) {
        throw new Error('Email đã tồn tại');
      }
    }

    await existing.update(data);
    return await this.getDoanVienById(id);
  }

  async deleteDoanVien(id) {
    // Business logic: Check exists
    const existing = await DoanVien.findByPk(id);
    if (!existing) {
      throw new Error('Đoàn viên không tồn tại');
    }

    // Business logic: Check if can delete (no related records)
    const taiKhoan = await TaiKhoan.findOne({ where: { idDV: id } });
    if (taiKhoan) {
      throw new Error('Không thể xóa đoàn viên đã có tài khoản');
    }

    await existing.destroy();
  }
}

module.exports = new DoanVienService();
```

### 4. Models (`src/models/<entity>.model.js`)

```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/database.config');

const DoanVien = sequelize.define('DoanVien', {
  idDV: {
    type: DataTypes.CHAR(15),
    primaryKey: true,
    allowNull: false
  },
  hoTen: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  ngaySinh: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gioiTinh: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  SDT: {
    type: DataTypes.STRING(11),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  diaChi: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  idChiDoan: {
    type: DataTypes.CHAR(15),
    allowNull: true,
    references: {
      model: 'ChiDoan',
      key: 'idChiDoan'
    }
  },
  ngayVaoDoan: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  noiChuyenDen: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  ngayChuyenDen: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  trangThaiSH: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  diemHD: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'DoanVien',
  timestamps: false
});

module.exports = DoanVien;
```

### Định nghĩa Relationships (`src/models/index.js`)

```javascript
const { sequelize } = require('../configs/database.config');

// Import models
const DoanVien = require('./doanvien.model');
const ChiDoan = require('./chidoan.model');
const Khoa = require('./khoa.model');
const TaiKhoan = require('./taikhoan.model');
const VaiTro = require('./vaitro.model');
const SoDoan = require('./sodoan.model');
const HoatDongDoan = require('./hoatdongdoan.model');
const DoanVienDangKi = require('./doanviendangki.model');

// Define relationships
// ChiDoan - Khoa
ChiDoan.belongsTo(Khoa, { foreignKey: 'idKhoa', as: 'khoa' });
Khoa.hasMany(ChiDoan, { foreignKey: 'idKhoa', as: 'chiDoans' });

// DoanVien - ChiDoan
DoanVien.belongsTo(ChiDoan, { foreignKey: 'idChiDoan', as: 'chiDoan' });
ChiDoan.hasMany(DoanVien, { foreignKey: 'idChiDoan', as: 'doanViens' });

// TaiKhoan - VaiTro
TaiKhoan.belongsTo(VaiTro, { foreignKey: 'idVaiTro', as: 'vaiTro' });
VaiTro.hasMany(TaiKhoan, { foreignKey: 'idVaiTro', as: 'taiKhoans' });

// TaiKhoan - DoanVien
TaiKhoan.belongsTo(DoanVien, { foreignKey: 'idDV', as: 'doanVien' });
DoanVien.hasOne(TaiKhoan, { foreignKey: 'idDV', as: 'taiKhoan' });

// SoDoan - DoanVien
SoDoan.belongsTo(DoanVien, { foreignKey: 'idDV', as: 'doanVien' });
DoanVien.hasOne(SoDoan, { foreignKey: 'idDV', as: 'soDoan' });

// HoatDongDoan - Khoa
HoatDongDoan.belongsTo(Khoa, { foreignKey: 'idKhoa', as: 'khoa' });
Khoa.hasMany(HoatDongDoan, { foreignKey: 'idKhoa', as: 'hoatDongs' });

// HoatDongDoan - ChiDoan
HoatDongDoan.belongsTo(ChiDoan, { foreignKey: 'idChiDoan', as: 'chiDoan' });
ChiDoan.hasMany(HoatDongDoan, { foreignKey: 'idChiDoan', as: 'hoatDongs' });

// DoanVien - HoatDongDoan (Many-to-Many)
DoanVien.belongsToMany(HoatDongDoan, {
  through: DoanVienDangKi,
  foreignKey: 'idDV',
  otherKey: 'idHD',
  as: 'hoatDongs'
});

HoatDongDoan.belongsToMany(DoanVien, {
  through: DoanVienDangKi,
  foreignKey: 'idHD',
  otherKey: 'idDV',
  as: 'doanViens'
});

module.exports = {
  sequelize,
  DoanVien,
  ChiDoan,
  Khoa,
  TaiKhoan,
  VaiTro,
  SoDoan,
  HoatDongDoan,
  DoanVienDangKi
};
```

### 5. Validators (`src/validators/<entity>.validator.js`)

```javascript
const { body } = require('express-validator');

const createDoanVien = [
  body('hoTen')
    .trim()
    .notEmpty()
    .withMessage('Họ tên không được để trống')
    .isLength({ min: 2, max: 100 })
    .withMessage('Họ tên phải từ 2-100 ký tự'),
  
  body('ngaySinh')
    .notEmpty()
    .withMessage('Ngày sinh không được để trống')
    .isDate()
    .withMessage('Ngày sinh không hợp lệ'),
  
  body('gioiTinh')
    .notEmpty()
    .withMessage('Giới tính không được để trống')
    .isIn(['Nam', 'Nữ', 'Khác'])
    .withMessage('Giới tính không hợp lệ'),
  
  body('SDT')
    .trim()
    .notEmpty()
    .withMessage('Số điện thoại không được để trống')
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email không được để trống')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  body('diaChi')
    .trim()
    .notEmpty()
    .withMessage('Địa chỉ không được để trống')
    .isLength({ max: 200 })
    .withMessage('Địa chỉ tối đa 200 ký tự'),
  
  body('idChiDoan')
    .trim()
    .notEmpty()
    .withMessage('Chi đoàn không được để trống'),
  
  body('ngayVaoDoan')
    .notEmpty()
    .withMessage('Ngày vào đoàn không được để trống')
    .isDate()
    .withMessage('Ngày vào đoàn không hợp lệ')
];

const updateDoanVien = [
  body('hoTen')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Họ tên phải từ 2-100 ký tự'),
  
  body('ngaySinh')
    .optional()
    .isDate()
    .withMessage('Ngày sinh không hợp lệ'),
  
  body('gioiTinh')
    .optional()
    .isIn(['Nam', 'Nữ', 'Khác'])
    .withMessage('Giới tính không hợp lệ'),
  
  body('SDT')
    .optional()
    .trim()
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  body('diaChi')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Địa chỉ tối đa 200 ký tự')
];

module.exports = {
  createDoanVien,
  updateDoanVien
};
```

### 6. Middlewares (`src/middlewares/auth.middleware.js`)

```javascript
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../configs/constants.config');

class AuthMiddleware {
  verifyToken(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token không được cung cấp'
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }
  }

  checkRole(...roles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Chưa xác thực'
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền truy cập'
        });
      }

      next();
    };
  }
}

module.exports = new AuthMiddleware();
```

### 7. Configs (`src/configs/database.config.js`)

```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_SERVER,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: true
      }
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Sync models (chỉ dùng trong development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✅ Models synchronized');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectDB
};
```

## 🎯 Nguyên tắc Clean Code

### 1. Tách biệt rõ ràng các tầng
- Routes chỉ định nghĩa endpoint
- Controllers chỉ xử lý request/response
- Services chứa business logic
- Models chỉ tương tác database

### 2. Single Responsibility Principle
- Mỗi function chỉ làm 1 việc
- Mỗi class chỉ có 1 lý do để thay đổi

### 3. Error Handling
- Luôn sử dụng try-catch
- Throw error với message rõ ràng
- Sử dụng error middleware để xử lý tập trung

### 4. Async/Await
- Luôn sử dụng async/await thay vì callback
- Không sử dụng .then().catch()

### 5. Naming Convention
- camelCase cho biến, function: `getDoanVien`, `userData`
- PascalCase cho class: `DoanVienController`, `AuthService`
- UPPER_CASE cho constants: `JWT_SECRET`, `MAX_FILE_SIZE`
- Tên file: lowercase với dấu chấm: `doanvien.controller.js`

### 6. Response Format
Luôn trả về format nhất quán:
```javascript
// Success
{
  success: true,
  message: 'Thông báo thành công',
  data: { ... }
}

// Error
{
  success: false,
  message: 'Thông báo lỗi',
  errors: [ ... ]
}
```

### 7. Status Codes
- 200: OK (GET, PUT, DELETE thành công)
- 201: Created (POST thành công)
- 400: Bad Request (Validation error)
- 401: Unauthorized (Chưa đăng nhập)
- 403: Forbidden (Không có quyền)
- 404: Not Found (Không tìm thấy)
- 500: Internal Server Error

## 📦 Dependencies chính

- **express**: Web framework
- **sequelize**: ORM for SQL Server
- **tedious**: SQL Server driver for Sequelize
- **express-validator**: Validation
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **dotenv**: Environment variables
- **cors**: CORS middleware

### Cài đặt ORM
```bash
npm install sequelize tedious
```

## 🚀 Cách thêm feature mới

1. Tạo model: `src/models/<entity>.model.js` (định nghĩa Sequelize model)
2. Thêm relationships vào `src/models/index.js`
3. Tạo service: `src/services/<entity>.service.js`
4. Tạo validator: `src/validators/<entity>.validator.js`
5. Tạo controller: `src/controllers/<entity>.controller.js`
6. Tạo route: `src/routes/<entity>.route.js`
7. Import route vào `src/routes/index.js`
8. Test API với Postman/Thunder Client

## 🔧 Setup Database với Sequelize

### 1. Tạo file `.env`
```env
NODE_ENV=development
PORT=5000

DB_SERVER=localhost
DB_NAME=QuanLyDoanVien
DB_USER=sa
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

### 2. Khởi tạo database trong `server.js`
```javascript
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./configs/database.config');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', require('./routes'));

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
```

## 📚 Sequelize Query Examples

### Basic Queries
```javascript
// Find all
const users = await DoanVien.findAll();

// Find by primary key
const user = await DoanVien.findByPk(id);

// Find one
const user = await DoanVien.findOne({ where: { email: 'test@example.com' } });

// Create
const newUser = await DoanVien.create({ hoTen: 'Nguyen Van A', email: 'a@example.com' });

// Update
await user.update({ hoTen: 'New Name' });
// or
await DoanVien.update({ hoTen: 'New Name' }, { where: { idDV: id } });

// Delete
await user.destroy();
// or
await DoanVien.destroy({ where: { idDV: id } });
```

### Advanced Queries
```javascript
// With relations
const doanvien = await DoanVien.findByPk(id, {
  include: [
    { model: ChiDoan, as: 'chiDoan' },
    { model: TaiKhoan, as: 'taiKhoan' }
  ]
});

// With conditions
const doanviens = await DoanVien.findAll({
  where: {
    [Op.or]: [
      { hoTen: { [Op.like]: '%search%' } },
      { email: { [Op.like]: '%search%' } }
    ],
    trangThaiSH: 'Đang hoạt động'
  },
  order: [['hoTen', 'ASC']],
  limit: 10,
  offset: 0
});

// Count
const count = await DoanVien.count({ where: { trangThaiSH: 'Đang hoạt động' } });

// Find and count
const { count, rows } = await DoanVien.findAndCountAll({
  where: { trangThaiSH: 'Đang hoạt động' },
  limit: 10,
  offset: 0
});
```

### Transactions
```javascript
const { sequelize } = require('../configs/database.config');

const t = await sequelize.transaction();

try {
  const doanvien = await DoanVien.create({ ... }, { transaction: t });
  const taikhoan = await TaiKhoan.create({ idDV: doanvien.idDV, ... }, { transaction: t });
  
  await t.commit();
  return doanvien;
} catch (error) {
  await t.rollback();
  throw error;
}
```

## ✅ Checklist khi code

- [ ] File đặt tên đúng convention
- [ ] Code đúng tầng (không viết business logic trong controller)
- [ ] Có validation cho input
- [ ] Có error handling (try-catch)
- [ ] Response format nhất quán
- [ ] Status code chính xác
- [ ] Sử dụng async/await
- [ ] Code clean, dễ đọc, có comment khi cần
- [ ] Không hardcode giá trị, sử dụng constants
- [ ] SQL injection safe (sử dụng parameterized queries)
