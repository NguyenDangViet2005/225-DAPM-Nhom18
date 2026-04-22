# Kế hoạch Triển khai Xác nhận hoàn thành Hoạt động

Cấu trúc Cơ sở dữ liệu hiện tại (bảng `DoanVienDangKi` và logic hàm `xacNhanHoanThanh`) không hỗ trợ việc **xác nhận hoàn thành cho từng sinh viên riêng lẻ**. Thay vào đó, thiết kế hệ thống là: **Bí thư xác nhận hoàn thành toàn bộ Hoạt động**, hệ thống sẽ tự động cộng điểm rèn luyện cho TẤT CẢ các sinh viên có trạng thái đơn đăng ký là "Đã duyệt" trong hoạt động đó.

Do đó, tôi đề xuất thay đổi Giao diện trang **Xác nhận hoàn thành** để phản ánh đúng logic này.

## User Review Required

> [!IMPORTANT]
> Thay vì hiển thị danh sách các "đoàn viên" để bấm Xác nhận từng người như bản vẽ cũ (Mock), trang này sẽ được thiết kế lại để **hiển thị danh sách các "Hoạt động" đang diễn ra**. Bí thư chỉ cần bấm "Xác nhận hoàn thành" cho Hoạt động đó, hệ thống sẽ lo việc cộng điểm cho tất cả những ai đã tham gia.

## Proposed Changes

### [MODIFY] `FE/src/pages/protected/bithu/hoat-dong-chi-doan/HoatDongChiDoanXacNhan.jsx`
- **Giao diện mới**:
  - Đổi bảng hiển thị từ danh sách Đoàn viên sang danh sách Hoạt động (Mã HĐ, Tên hoạt động, Ngày tổ chức, Số đoàn viên tham gia, Trạng thái).
  - Lọc ra những hoạt động thuộc Chi đoàn đang ở trạng thái "Đã duyệt" (tức là đã mở và chưa kết thúc).
- **Logic mới**:
  - Sử dụng API `hoatdongAPI.getAllChidoanActivities()` để lấy danh sách hoạt động.
  - Khi bấm nút **Xác nhận hoàn thành**, gọi API `hoatdongAPI.xacNhanHoanThanh(idHD)`.
  - Hiển thị thông báo thành công (số lượng sinh viên được cộng điểm) và tải lại bảng dữ liệu.

## Verification Plan
1. Truy cập vào trang Xác nhận hoàn thành của Bí thư.
2. Hệ thống sẽ hiển thị các Hoạt động (VD: Dọn vệ sinh Test).
3. Bấm "Xác nhận hoàn thành" trên dòng hoạt động đó.
4. Trạng thái hoạt động sẽ chuyển thành "Đã kết thúc", và danh sách biến mất (do đã hoàn thành). Các sinh viên "Đã duyệt" của hoạt động đó sẽ được cộng điểm rèn luyện trong DB.
