const { HoatDongDoan } = require("../models");

const hoatdongService = {
  // Get ALL activities with pagination (school + khoa + chidoan)
  async getAllSchoolActivities({ page = 1, limit = 10 } = {}) {
    try {
      const offset = (page - 1) * limit;
      const { count, rows: activities } = await HoatDongDoan.findAndCountAll({
        order: [["ngayToChuc", "DESC"]],
        limit,
        offset,
      });

      return {
        success: true,
        data: activities,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Lỗi lấy danh sách hoạt động",
        error: error.message,
      };
    }
  },

  // Get activity by ID
  async getActivityById(idHD) {
    try {
      const activity = await HoatDongDoan.findByPk(idHD);
      if (!activity) {
        return {
          success: false,
          message: "Hoạt động không tồn tại",
        };
      }
      return {
        success: true,
        data: activity,
      };
    } catch (error) {
      return {
        success: false,
        message: "Lỗi lấy thông tin hoạt động",
        error: error.message,
      };
    }
  },

  // Create activity — auto-approve only if creator is DOANTRUONG
  async createActivity(activityData) {
    try {
      const isDoanTruong = activityData.creatorRole === "DOANTRUONG";

      const activity = await HoatDongDoan.create({
        idHD: activityData.idHD,
        tenHD: activityData.tenHD,
        moTa: activityData.moTa,
        ngayToChuc: activityData.ngayToChuc,
        diaDiem: activityData.diaDiem,
        soLuongMax: activityData.soLuongMax,
        soLuongDaDK: 0,
        trangThai: activityData.trangThai || "Đang mở",
        trangThaiHD: isDoanTruong ? "Đã duyệt" : "Chưa duyệt",
        donViToChuc: activityData.donViToChuc || "Đoàn Trường",
        diemHD: activityData.diemHD || 0,
        idKhoa: null,
        idChiDoan: null,
      });
      return {
        success: true,
        message: "Tạo hoạt động thành công",
        data: activity,
      };
    } catch (error) {
      return {
        success: false,
        message: "Lỗi tạo hoạt động",
        error: error.message,
      };
    }
  },

  // Update activity — only allowed for school-level (idKhoa = null, idChiDoan = null)
  async updateActivity(idHD, updateData) {
    try {
      const activity = await HoatDongDoan.findByPk(idHD);
      if (!activity) {
        return {
          success: false,
          message: "Hoạt động không tồn tại",
        };
      }

      // Permission guard: Đoàn Trường can only edit school-level activities
      if (activity.idKhoa !== null || activity.idChiDoan !== null) {
        return {
          success: false,
          message: "Không có quyền chỉnh sửa hoạt động của Đoàn Khoa hoặc Chi Đoàn",
        };
      }

      const allowedFields = [
        "tenHD",
        "moTa",
        "ngayToChuc",
        "diaDiem",
        "soLuongMax",
        "trangThai",
        "diemHD",
        "donViToChuc",
      ];

      const updatePayload = {};
      allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
          updatePayload[field] = updateData[field];
        }
      });

      // Sanitize ngayToChuc: ensure it is a clean YYYY-MM-DD string
      if (updatePayload.ngayToChuc) {
        const parsedDate = new Date(updatePayload.ngayToChuc);
        if (!isNaN(parsedDate.getTime())) {
          updatePayload.ngayToChuc = parsedDate.toISOString().split("T")[0];
        } else {
          delete updatePayload.ngayToChuc;
        }
      }

      await activity.update(updatePayload);

      return {
        success: true,
        message: "Cập nhật hoạt động thành công",
        data: activity,
      };
    } catch (error) {
      return {
        success: false,
        message: "Lỗi cập nhật hoạt động",
        error: error.message,
      };
    }
  },

  // Delete activity
  async deleteActivity(idHD) {
    try {
      const activity = await HoatDongDoan.findByPk(idHD);
      if (!activity) {
        return {
          success: false,
          message: "Hoạt động không tồn tại",
        };
      }

      await activity.destroy();

      return {
        success: true,
        message: "Xóa hoạt động thành công",
      };
    } catch (error) {
      return {
        success: false,
        message: "Lỗi xóa hoạt động",
        error: error.message,
      };
    }
  },

  // Get registrations for an activity
  async getActivityRegistrations(idHD) {
    try {
      const { DoanVienDangKi, DoanVien } = require("../models");

      const registrations = await DoanVienDangKi.findAll({
        where: { idHD },
        attributes: [
          "idDV",
          "idHD",
          "ngayDangKi",
          "trangThaiDuyet",
          "lyDoTuChoi",
        ],
        include: [
          {
            model: DoanVien,
            as: "doanVien",
            attributes: [
              "idDV",
              "hoTen",
              "ngaySinh",
              "gioiTinh",
              "SDT",
              "email",
              "diaChi",
            ],
          },
        ],
        order: [["ngayDangKi", "DESC"]],
      });

      return {
        success: true,
        data: registrations,
      };
    } catch (error) {
      return {
        success: false,
        message: "Lỗi lấy danh sách đăng ký hoạt động",
        error: error.message,
      };
    }
  },
};

module.exports = hoatdongService;
