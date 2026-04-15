const {
  DoanVienDangKi,
  DoanVien,
  ChiDoan,
  HoatDongDoan,
} = require("../models");

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
          message:
            "Không có quyền chỉnh sửa hoạt động của Đoàn Khoa hoặc Chi Đoàn",
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

  // Lấy danh sách đăng ký của 1 hoạt động (chỉ hoạt động cấp Đoàn Trường)
  async getDanhSachDangKy(idHD) {
    try {
      // Kiểm tra hoạt động có thuộc cấp Đoàn Trường không (idKhoa = null & idChiDoan = null)
      const hoatDong = await HoatDongDoan.findOne({
        where: { idHD, idKhoa: null, idChiDoan: null },
      });

      if (!hoatDong) {
        return {
          success: false,
          message: "Hoạt động không thuộc cấp Đoàn Trường hoặc không tồn tại",
        };
      }

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
            attributes: ["idDV", "hoTen"],
            include: [
              {
                model: ChiDoan,
                as: "chiDoan",
                attributes: ["tenChiDoan"],
              },
            ],
          },
          {
            model: HoatDongDoan,
            as: "hoatDong",
            attributes: ["idHD", "tenHD"],
            where: { idKhoa: null, idChiDoan: null },
            required: true,
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

  // Duyệt hoặc từ chối đăng ký của 1 đoàn viên
  async duyetDangKy(idHD, idDV, trangThai, lyDo) {
    try {
      const { DoanVienDangKi } = require("../models");

      const dangKy = await DoanVienDangKi.findOne({
        where: { idHD, idDV },
      });

      if (!dangKy) {
        return {
          success: false,
          message: "Không tìm thấy thông tin đăng ký này",
        };
      }

      await dangKy.update({
        trangThaiDuyet: trangThai,
        lyDoTuChoi: lyDo || null,
      });

      return {
        success: true,
        message: `Đã cập nhật trạng thái thành: ${trangThai}`,
        data: dangKy,
      };
    } catch (error) {
      return {
        success: false,
        message: "Lỗi cập nhật trạng thái đăng ký",
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
      return { success: false, message: "Lỗi xác nhận hoàn thành", error: error.message };
    }
  },

  // Lấy tất cả đơn đăng ký (mọi trạng thái) từ tất cả hoạt động Đoàn Trường
  async getAllRegistrations() {
    try {
      const { DoanVienDangKi, DoanVien, ChiDoan, HoatDongDoan } = require("../models");
      const registrations = await DoanVienDangKi.findAll({
        attributes: ["idDV", "idHD", "ngayDangKi", "trangThaiDuyet", "lyDoTuChoi"],
        include: [
          {
            model: DoanVien, as: "doanVien", attributes: ["idDV", "hoTen"],
            include: [{ model: ChiDoan, as: "chiDoan", attributes: ["tenChiDoan"] }],
          },
          {
            model: HoatDongDoan, as: "hoatDong", attributes: ["idHD", "tenHD"],
            where: { idKhoa: null, idChiDoan: null },
            required: true,
          },
        ],
        order: [["ngayDangKi", "DESC"]],
      });

      const formattedData = registrations.map((reg) => ({
        maSV: reg.idDV?.trim(),
        idDV: reg.idDV?.trim(),
        hoTen: reg.doanVien?.hoTen?.trim() || "",
        tenChiDoan: reg.doanVien?.chiDoan?.tenChiDoan?.trim() || "—",
        idHD: reg.idHD?.trim(),
        tenHD: reg.hoatDong?.tenHD?.trim() || "",
        ngayDangKi: reg.ngayDangKi,
        trangThaiDuyet: reg.trangThaiDuyet?.trim(),
        lyDoTuChoi: reg.lyDoTuChoi,
      }));

      return { success: true, data: formattedData };
    } catch (error) {
      return { success: false, message: "Lỗi lấy danh sách đăng ký", error: error.message };
    }
  },

  // Lấy tất cả đơn đăng ký chờ duyệt từ tất cả hoạt động Đoàn Trường
  async getAllPendingRegistrations() {
    try {
      const {
        DoanVienDangKi,
        DoanVien,
        ChiDoan,
        HoatDongDoan,
      } = require("../models");

      // Lấy tất cả hoạt động Đoàn Trường và các đơn đăng ký chờ duyệt
      const registrations = await DoanVienDangKi.findAll({
        where: {
          trangThaiDuyet: "Chờ duyệt",
        },
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
            attributes: ["idDV", "hoTen"],
            include: [
              {
                model: ChiDoan,
                as: "chiDoan",
                attributes: ["tenChiDoan"],
              },
            ],
          },
          {
            model: HoatDongDoan,
            as: "hoatDong",
            attributes: ["idHD", "tenHD"],
            where: { idKhoa: null, idChiDoan: null }, // Chỉ Đoàn Trường
            required: true,
          },
        ],
        order: [["ngayDangKi", "DESC"]],
      });

      // Format lại dữ liệu để FE dễ sử dụng
      const formattedData = registrations.map((reg) => ({
        maSV: reg.idDV?.trim(),
        idDV: reg.idDV?.trim(),
        hoTen: reg.doanVien?.hoTen?.trim() || "",
        tenChiDoan: reg.doanVien?.chiDoan?.tenChiDoan?.trim() || "—",
        idHD: reg.idHD?.trim(),
        tenHD: reg.hoatDong?.tenHD?.trim() || "",
        ngayDangKi: reg.ngayDangKi,
        trangThaiDuyet: reg.trangThaiDuyet?.trim(),
        lyDoTuChoi: reg.lyDoTuChoi,
      }));

      return {
        success: true,
        data: formattedData,
      };
    } catch (error) {
      return {
        success: false,
        message: "Lỗi lấy danh sách đăng ký chờ duyệt",
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
          idKhoa: {
            [require("sequelize").Op.ne]: null,
          },
          idChiDoan: {
            [require("sequelize").Op.ne]: null,
          },
        },
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
        message: "Lỗi lấy danh sách hoạt động chi đoàn",
        error: error.message,
      };
    }
  },
};

module.exports = hoatdongService;
