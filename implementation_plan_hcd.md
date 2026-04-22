# Kế hoạch Triển khai tính năng Danh sách Đăng ký Hoạt động (Bí thư Chi đoàn)

Tính năng "Danh sách đăng ký" hiện tại của Bí thư đang sử dụng dữ liệu giả (Mock Data). Để nối API và hoàn thiện tính năng này, tôi đề xuất kế hoạch sau:

## User Review Required

> [!IMPORTANT]
> Việc nối API sẽ yêu cầu tạo thêm một số endpoint mới ở Backend để Bí thư có thể lấy đúng danh sách các đoàn viên đăng ký vào **các hoạt động thuộc chi đoàn của mình**. Vui lòng xem xét các thay đổi bên dưới.

## Proposed Changes

### 1. Phía Backend (BE)
#### [MODIFY] `BE/src/routes/doanviendangki.routes.js`
- Thêm endpoint `GET /chidoan/registrations/all` dành riêng cho vai trò `BITHU`.
- Cấp quyền cho `BITHU` truy cập một số tính năng lấy danh sách.

#### [MODIFY] `BE/src/controllers/doanviendangki.controller.js`
- Thêm hàm `getChiDoanRegistrations` để gọi xuống tầng Service.

#### [MODIFY] `BE/src/services/doanviendangki.service.js`
- Thêm hàm `getChiDoanRegistrations(idUser)`: 
  - Bước 1: Tìm `idChiDoan` của Bí thư hiện tại thông qua `idUser`.
  - Bước 2: Tìm tất cả `HoatDongDoan` có `idChiDoan` trùng khớp.
  - Bước 3: Query bảng `DoanVienDangKi` để lấy danh sách sinh viên đã đăng ký vào các hoạt động đó.

### 2. Phía Frontend (FE)
#### [NEW] `FE/src/apis/hoatdong.api.js` (hoặc api tương đương)
- Cập nhật/thêm hàm `getChiDoanRegistrationsAPI` để gọi GET tới endpoint vừa tạo.
- (Đã có sẵn `getChidoanActivities` API, dùng để lấy danh sách dropdown bộ lọc).

#### [MODIFY] `FE/src/pages/protected/bithu/hoat-dong-chi-doan/HoatDongChiDoanDanhSach.jsx`
- Xóa bỏ việc import `MOCK_HOAT_DONG` và `MOCK_DANG_KY_HOAT_DONG`.
- Sử dụng `useEffect` để fetch dữ liệu thật từ Backend (Hoạt động của chi đoàn & Danh sách đăng ký).
- Gắn dữ liệu thật vào bảng hiển thị và các thẻ thống kê (Tổng đăng ký, Chờ duyệt, Đã duyệt, Từ chối).

## Verification Plan
- Truy cập vào tài khoản Bí thư, vào menu **Hoạt động chi đoàn > Danh sách đăng ký**.
- Hệ thống sẽ hiển thị các dữ liệu thật từ database, các bộ lọc (Tìm kiếm, Trạng thái, Tên hoạt động) sẽ hoạt động trơn tru với dữ liệu thực tế này.
