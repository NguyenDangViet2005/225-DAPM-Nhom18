const {
  DoanVienDangKi,
  DoanVien,
  ChiDoan,
  HoatDongDoan,
  Khoa,
} = require("../models");
const { Op } = require("sequelize");

const doanviendangkiService = {
  // Lấy danh sách hoạt động đang mở cho đoàn viên đăng ký
  async getAvailableActivities({ idDV } = {}) {
    try {
      const activities = await HoatDongDoan.findAll({
        where: { trangThaiHD: "Đang mở" },
        attributes: ["idHD", "tenHD", "moTa", "ngayToChuc", "diaDiem",
          "soLuongMax", "soLuongDaDK", "diemHD", "trangThaiHD", "donViToChuc"],
        order: [["ngayToChuc", "ASC"]],
      });

      // Nếu có idDV → đánh dấu hoạt động đã đăng ký
      let registeredIds = [];
      if (idDV) {
        const myRegs = await DoanVienDangKi.findAll({
          where: { idDV },
          attributes: ["idHD", "trangThaiDuyet"],
        });
        registeredIds = myRegs.map(r => ({
          idHD: r.idHD?.trim(),
          trangThaiDuyet: r.trangThaiDuyet?.trim(),
        }));
      }

      const data = activities.map(hd => {
        const reg = registeredIds.find(r => r.idHD === hd.idHD?.trim());
        return {
          ...hd.toJSON(),
          idHD: hd.idHD?.trim(),
          daDangKy: !!reg,
          trangThaiDangKy: reg?.trangThaiDuyet ?? null,
        };
      });

      return { success: true, data };
    } catch (error) {
      return { success: false, message: "Lỗi lấy danh sách hoạt động", error: error.message };
    }
  },

  // Đoàn viên đăng ký hoạt động
  async dangKyHoatDong(idDV, idHD) {
    try {
      const existing = await DoanVienDangKi.findOne({ where: { idDV, idHD } });
      if (existing) return { success: false, message: "Bạn đã đăng ký hoạt động này rồi" };

      const hoatDong = await HoatDongDoan.findByPk(idHD);
      if (!hoatDong) return { success: false, message: "Hoạt động không tồn tại" };
      if (hoatDong.trangThaiHD !== "Đang mở") return { success: false, message: "Hoạt động không còn mở đăng ký" };
      if (hoatDong.soLuongDaDK >= hoatDong.soLuongMax) return { success: false, message: "Hoạt động đã đủ số lượng" };

      await DoanVienDangKi.create({
        idDV,
        idHD,
        ngayDangKi: new Date(),
        trangThaiDuyet: "Chờ duyệt",
        lyDoTuChoi: null,
      });

      return { success: true, message: "Đăng ký thành công! Vui lòng chờ duyệt." };
    } catch (error) {
      return { success: false, message: "Lỗi đăng ký hoạt động", error: error.message };
    }
  },

  // Đoàn viên hủy đăng ký hoạt động
  async huyDangKy(idDV, idHD) {
    try {
      const existing = await DoanVienDangKi.findOne({ where: { idDV, idHD } });
      if (!existing) return { success: false, message: "Không tìm thấy đăng ký" };
      if (existing.trangThaiDuyet === "Đã duyệt") return { success: false, message: "Không thể hủy đăng ký đã được duyệt" };

      await existing.destroy();
      return { success: true, message: "Hủy đăng ký thành công" };
    } catch (error) {
      return { success: false, message: "Lỗi hủy đăng ký", error: error.message };
    }
  },
  async duyetDangKy(idHD, idDV, trangThai, lyDo) {
    try {
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

      // Auto-update soLuongDaDK in HoatDongDoan (count only "Đã duyệt")
      const { count: approvedCount } = await DoanVienDangKi.findAndCountAll({
        where: { idHD, trangThaiDuyet: "Đã duyệt" },
      });

      await HoatDongDoan.update(
        { soLuongDaDK: approvedCount },
        { where: { idHD } },
      );

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

  // Lấy tất cả đơn đăng ký (mọi trạng thái) từ tất cả hoạt động Đoàn Trường (chỉ hoạt động chưa kết thúc)
  async getAllRegistrations() {
    try {
      const registrations = await DoanVienDangKi.findAll({
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
            where: {
              idKhoa: null,
              idChiDoan: null,
              trangThaiHD: { [Op.ne]: "Đã kết thúc" },
            },
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
      return {
        success: false,
        message: "Lỗi lấy danh sách đăng ký",
        error: error.message,
      };
    }
  },

  // Lấy tất cả đơn đăng ký chờ duyệt từ tất cả hoạt động Đoàn Trường (chỉ hoạt động chưa kết thúc)
  async getAllPendingRegistrations() {
    try {
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
                include: [
                  {
                    model: Khoa,
                    as: "khoa",
                    attributes: ["tenKhoa"],
                  },
                ],
              },
            ],
          },
          {
            model: HoatDongDoan,
            as: "hoatDong",
            attributes: ["idHD", "tenHD"],
            where: {
              idKhoa: null,
              idChiDoan: null,
              trangThaiHD: { [Op.ne]: "Đã kết thúc" },
            },
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
        tenKhoa: reg.doanVien?.chiDoan?.khoa?.tenKhoa?.trim() || "—",
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

  // Dashboard data cho Đoàn Trường
  async getDoanTruongDashboardData() {
    try {
      const pendingRegistrations = await DoanVienDangKi.findAll({
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
                include: [
                  {
                    model: Khoa,
                    as: "khoa",
                    attributes: ["tenKhoa"],
                  },
                ],
              },
            ],
          },
          {
            model: HoatDongDoan,
            as: "hoatDong",
            attributes: ["idHD", "tenHD", "trangThaiHD"],
            where: {
              idKhoa: null,
              idChiDoan: null,
              trangThaiHD: { [Op.ne]: "Đã kết thúc" },
            },
            required: true,
          },
        ],
        order: [["ngayDangKi", "DESC"]],
      });

      const [tongDoanVien, tongKhoa, tongHoatDongCapTruongConHieuLuc] =
        await Promise.all([
          DoanVien.count(),
          Khoa.count(),
          HoatDongDoan.count({
            where: {
              idKhoa: null,
              idChiDoan: null,
              trangThaiHD: { [Op.ne]: "Đã kết thúc" },
            },
          }),
        ]);

      const recentMembers = pendingRegistrations.map((reg) => ({
        maSV: reg.idDV?.trim(),
        idDV: reg.idDV?.trim(),
        hoTen: reg.doanVien?.hoTen?.trim() || "",
        tenChiDoan: reg.doanVien?.chiDoan?.tenChiDoan?.trim() || "—",
        tenKhoa: reg.doanVien?.chiDoan?.khoa?.tenKhoa?.trim() || "—",
        idHD: reg.idHD?.trim(),
        tenHD: reg.hoatDong?.tenHD?.trim() || "",
        ngayDangKi: reg.ngayDangKi,
        trangThaiDuyet: reg.trangThaiDuyet?.trim(),
      }));

      return {
        success: true,
        data: {
          stats: {
            tongDoanVien,
            tongKhoa,
            tongHoatDongCapTruongConHieuLuc,
            tongHoSoChoDuyet: pendingRegistrations.length,
          },
          recentMembers,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Lỗi lấy dữ liệu dashboard Đoàn Trường",
        error: error.message,
      };
    }
  },

  // Get all registrations for a specific activity (các trạng thái)
  async getActivityRegistrations(idHD) {
    try {
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

  // Get only approved registrations for a specific activity (trangThaiDuyet = "Đã duyệt")
  async getApprovedActivityRegistrations(idHD) {
    try {
      const registrations = await DoanVienDangKi.findAll({
        where: { idHD, trangThaiDuyet: "Đã duyệt" },
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
        message: "Lỗi lấy danh sách đoàn viên đã duyệt",
        error: error.message,
      };
    }
  },
};

module.exports = doanviendangkiService;
