const { DoanVienDangKi, HoatDongDoan } = require("../models");

const hoatdongService = {
  // Get ALL activities with pagination (school + khoa + chidoan)
  async getAllSchoolActivities({ page = 1, limit = 10 } = {}) {
    try {
      const offset = (page - 1) * limit;
      const { count, rows: activities } = await HoatDongDoan.findAndCountAll({
        where: {
          idKhoa: null,
          idChiDoan: null,
        },
        order: [["ngayToChuc", "DESC"]],
        limit,
        offset,
      });

      // Calculate actual soLuongDaDK from DoanVienDangKi for each activity (only "Đã duyệt")
      const activitiesWithCount = await Promise.all(
        activities.map(async (hd) => {
          const { count: registrationCount } =
            await DoanVienDangKi.findAndCountAll({
              where: { idHD: hd.idHD, trangThaiDuyet: "Đã duyệt" },
            });
          return {
            ...hd.toJSON(),
            soLuongDaDK: registrationCount,
          };
        }),
      );

      return {
        success: true,
        data: activitiesWithCount,
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

      // Calculate actual soLuongDaDK from DoanVienDangKi (only "Đã duyệt")
      const { count: registrationCount } = await DoanVienDangKi.findAndCountAll(
        {
          where: { idHD, trangThaiDuyet: "Đã duyệt" },
        },
      );

      const activityData = {
        ...activity.toJSON(),
        soLuongDaDK: registrationCount,
      };

      return {
        success: true,
        data: activityData,
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
        idKhoa: activityData.idKhoa || null,
        idChiDoan: activityData.idChiDoan || null,
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

  // Update activity
  async updateActivity(idHD, updateData, userRole, userChiDoan) {
    try {
      const activity = await HoatDongDoan.findByPk(idHD);
      if (!activity) {
        return {
          success: false,
          message: "Hoạt động không tồn tại",
        };
      }

      // Permission guard:
      if (userRole === "BITHU") {
        if (activity.idChiDoan !== userChiDoan) {
          return { success: false, message: "Không có quyền chỉnh sửa hoạt động của Chi đoàn khác" };
        }
      } else if (userRole === "DOANTRUONG") {
        if (activity.idKhoa !== null || activity.idChiDoan !== null) {
          return { success: false, message: "Không có quyền chỉnh sửa hoạt động của Đoàn Khoa hoặc Chi Đoàn" };
        }
      } else {
        // Fallback for demo if no role is strictly matched, just allow if it's Doan Khoa for now or reject
        // We will just let Doan Khoa edit their own if needed in future
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
      
      // Nếu là Bí thư sửa, reset trạng thái về Chưa duyệt để gửi lại yêu cầu
      if (userRole === "BITHU") {
        updatePayload.trangThaiHD = "Chưa duyệt";
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

  // Xác nhận hoàn thành hoạt động & cộng điểm cho đoàn viên đã duyệt
  async xacNhanHoanThanh(idHD) {
    try {
      const { HoatDongDoan, DoanVienDangKi, DoanVien } = require("../models");
      const { Op } = require("sequelize");

      // 1. Kiểm tra hoạt động tồn tại
      const hoatDong = await HoatDongDoan.findByPk(idHD);
      if (!hoatDong) {
        return { success: false, message: "Hoạt động không tồn tại" };
      }

      const diemHD = hoatDong.diemHD || 0;

      // 2. Lấy danh sách đoàn viên đã được duyệt
      const danhSachDaDuyet = await DoanVienDangKi.findAll({
        where: { idHD, trangThaiDuyet: "Đã duyệt" },
        attributes: ["idDV"],
      });

      const idDVList = danhSachDaDuyet.map((dk) => dk.idDV);

      // 3. Cộng điểm cho từng đoàn viên
      if (idDVList.length > 0 && diemHD > 0) {
        await DoanVien.increment("diemHD", {
          by: diemHD,
          where: { idDV: { [Op.in]: idDVList } },
        });
      }

      // 4. Cập nhật trạng thái hoạt động thành 'Đã kết thúc'
      await hoatDong.update({ trangThaiHD: "Đã kết thúc" });

      return {
        success: true,
        message: `Đã xác nhận hoàn thành & cộng ${diemHD} điểm cho ${idDVList.length} đoàn viên`,
        data: { soLuongDuocCong: idDVList.length, diemCong: diemHD },
      };
    } catch (error) {
      return {
        success: false,
        message: "Lỗi xác nhận hoàn thành",
        error: error.message,
      };
    }
  },

  // Get all khoa-level activities (idKhoa != null, idChiDoan = null)
  async getAllKhoaActivities({ page = 1, limit = 10 } = {}) {
    try {
      const offset = (page - 1) * limit;
      const { count, rows: activities } = await HoatDongDoan.findAndCountAll({
        where: {
          idKhoa: {
            [require("sequelize").Op.ne]: null,
          },
          idChiDoan: null,
        },
        order: [["ngayToChuc", "DESC"]],
        limit,
        offset,
      });

      // Calculate actual soLuongDaDK from DoanVienDangKi for each activity (only "Đã duyệt")
      const activitiesWithCount = await Promise.all(
        activities.map(async (hd) => {
          const { count: registrationCount } =
            await DoanVienDangKi.findAndCountAll({
              where: { idHD: hd.idHD, trangThaiDuyet: "Đã duyệt" },
            });
          return {
            ...hd.toJSON(),
            soLuongDaDK: registrationCount,
          };
        }),
      );

      return {
        success: true,
        data: activitiesWithCount,
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
        message: "Lỗi lấy danh sách hoạt động khoa",
        error: error.message,
      };
    }
  },

  // Get all chi doan-level activities (idKhoa = null, idChiDoan != null)
  async getAllChidoanActivities({ page = 1, limit = 10 } = {}) {
    try {
      const offset = (page - 1) * limit;
      const { count, rows: activities } = await HoatDongDoan.findAndCountAll({
        where: {
          idKhoa: null,
          idChiDoan: {
            [require("sequelize").Op.ne]: null,
          },
        },
        order: [["ngayToChuc", "DESC"]],
        limit,
        offset,
      });

      // Calculate actual soLuongDaDK from DoanVienDangKi for each activity (only "Đã duyệt")
      const activitiesWithCount = await Promise.all(
        activities.map(async (hd) => {
          const { count: registrationCount } =
            await DoanVienDangKi.findAndCountAll({
              where: { idHD: hd.idHD, trangThaiDuyet: "Đã duyệt" },
            });
          return {
            ...hd.toJSON(),
            soLuongDaDK: registrationCount,
          };
        }),
      );

      return {
        success: true,
        data: activitiesWithCount,
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
        message: "Lỗi lấy danh sách hoạt động chi đoàn",
        error: error.message,
      };
    }
  },

  // ─────────────────────────────────────────────────────────
  // PHÊ DUYỆT YÊU CẦU HOẠT ĐỘNG
  // ─────────────────────────────────────────────────────────

  // Lấy danh sách các hoạt động do Liên chi / Chi đoàn đề xuất (Yêu cầu duyệt)
  async getYeuCauActivities({ page = 1, limit = 10, status = "all" } = {}) {
    try {
      const { Op } = require("sequelize");
      const offset = (page - 1) * limit;

      const whereCondition = {
        [Op.or]: [
          { idKhoa: { [Op.ne]: null } },
          { idChiDoan: { [Op.ne]: null } },
        ],
      };

      if (status !== "all") {
        whereCondition.trangThaiHD = status;
      }

      const { count, rows: activities } = await HoatDongDoan.findAndCountAll({
        where: whereCondition,
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
        message: "Lỗi lấy danh sách yêu cầu mở hoạt động",
        error: error.message,
      };
    }
  },

  // Duyệt yêu cầu
  async approveActivity(idHD) {
    try {
      const activity = await HoatDongDoan.findByPk(idHD);
      if (!activity)
        return { success: false, message: "Hoạt động không tồn tại" };

      await activity.update({ trangThaiHD: "Đã duyệt" });

      return { success: true, message: "Đã duyệt hoạt động thành công" };
    } catch (error) {
      return {
        success: false,
        message: "Lỗi duyệt hoạt động",
        error: error.message,
      };
    }
  },

  // Từ chối yêu cầu
  async rejectActivity(idHD) {
    try {
      const activity = await HoatDongDoan.findByPk(idHD);
      if (!activity)
        return { success: false, message: "Hoạt động không tồn tại" };

      await activity.update({ trangThaiHD: "Từ chối" });

      return { success: true, message: "Đã từ chối hoạt động" };
    } catch (error) {
      return {
        success: false,
        message: "Lỗi từ chối hoạt động",
        error: error.message,
      };
    }
  },

  // Get all available activities (all levels) - for doàn viên và bí thư đăng ký
  async getAvailableActivities({ idDV } = {}) {
    try {
      const { Op } = require("sequelize");
      
      // Nếu có idDV → lấy danh sách idHD đã đăng ký
      let registeredIds = [];
      if (idDV) {
        const myRegs = await DoanVienDangKi.findAll({
          where: { idDV },
          attributes: ["idHD"],
        });
        registeredIds = myRegs.map(r => r.idHD?.trim()).filter(Boolean);
      }

      // Lấy hoạt động đang mở, đã duyệt
      // Bỏ điều kiện ngayToChuc > now để hiển thị cả hoạt động đã qua (cho demo/test)
      const whereCondition = {
        trangThai: "Đang mở",
        trangThaiHD: "Đã duyệt",
      };
      
      if (idDV && registeredIds.length > 0) {
        whereCondition.idHD = { [Op.notIn]: registeredIds };
      }

      const activities = await HoatDongDoan.findAll({
        where: whereCondition,
        order: [["ngayToChuc", "DESC"]], // Sắp xếp mới nhất trước
      });

      // Calculate actual soLuongDaDK from DoanVienDangKi for each activity (only "Đã duyệt")
      const activitiesWithCount = await Promise.all(
        activities.map(async (hd) => {
          const { count: registrationCount } =
            await DoanVienDangKi.findAndCountAll({
              where: { idHD: hd.idHD, trangThaiDuyet: "Đã duyệt" },
            });
          
          return {
            ...hd.toJSON(),
            soLuongDaDK: registrationCount,
            daDangKy: false, // Luôn false vì đã lọc ra các hoạt động chưa đăng ký
            trangThaiDangKy: null,
          };
        }),
      );

      return {
        success: true,
        data: activitiesWithCount,
      };
    } catch (error) {
      return {
        success: false,
        message: "Lỗi lấy danh sách hoạt động đang mở",
        error: error.message,
      };
    }
  },
};

module.exports = hoatdongService;
