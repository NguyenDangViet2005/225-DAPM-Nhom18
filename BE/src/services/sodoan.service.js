const { SoDoan, DoanVien, ChiDoan, Khoa } = require("../models");

const sodoanService = {
  /**
   * Lấy thông tin sổ đoàn của đoàn viên theo idDV
   */
  getMySoDoan: async (idDV) => {
    const soDoan = await SoDoan.findOne({
      where: { idDV },
    });

    if (!soDoan) return null;

    // Trim CHAR fields
    const data = soDoan.toJSON();
    for (const key in data) {
      if (typeof data[key] === "string") data[key] = data[key].trim();
    }
    return data;
  },

  getLopSoDoan: async (idDV) => {
    // Lấy chi đoàn của bí thư
    const biThu = await DoanVien.findByPk(idDV);
    if (!biThu) throw new Error("Không tìm thấy thông tin bí thư");

    const idChiDoan = biThu.idChiDoan;

    // Lấy tất cả sinh viên trong chi đoàn kèm với thông tin sổ đoàn của họ
    const doanViens = await DoanVien.findAll({
      where: { idChiDoan },
      include: [
        {
          model: SoDoan,
          as: "soDoan",
        },
      ],
      order: [["hoTen", "ASC"]],
    });

    // Format lại dữ liệu trả về giống với cấu trúc hiện tại mảng SoDoan
    // Sử dụng hàm helper nhỏ để loại bỏ khoảng trắng dư ở các trường chuỗi CHAR
    const trimValues = (obj) => {
      const result = { ...obj };
      for (const key in result) {
        if (typeof result[key] === "string") {
          result[key] = result[key].trim();
        }
      }
      return result;
    };

    const mappedData = doanViens.map((dv) => {
      const dvData = trimValues(dv.toJSON());
      if (dv.soDoan) {
        const sdData = trimValues(dv.soDoan.toJSON());
        return {
          ...sdData,
          doanVien: dvData,
        };
      } else {
        return {
          idSoDoan: null,
          idDV: dvData.idDV, // Đã được trim ở hàm helper
          trangThai: "Chưa nộp sổ",
          ngayCap: null,
          noiCap: null,
          doanVien: dvData,
        };
      }
    });

    // Chỉ trả về các đoàn viên có sổ đoàn ở trạng thái "Chưa nộp sổ"
    return mappedData.filter((item) => item.trangThai === "Chưa nộp sổ");
  },

  submitLopSoDoan: async (idSoDoans) => {
    // Phân loại: Danh sách này có thể bao gồm idSoDoan (SDxxx) hoặc idDV (DHxxx)
    // - Trường hợp idDV: Nếu chưa có SoDoan, ta phải tạo mới SoDoan cho user đó.
    // Thường id SoDoan sẽ bắt đầu bằng 'SD', id DV có thể là 'DH', v.v. Tuỳ cấu trúc DB.

    const isDoanVienId = (id) => !id.startsWith("SD"); // Giả định SD là prefix của Sổ Đoàn

    const sodoanIds = idSoDoans.filter((id) => !isDoanVienId(id));
    const dvIds_without_sodoan = idSoDoans.filter((id) => isDoanVienId(id));

    // Update sổ hiện có
    if (sodoanIds.length > 0) {
      await SoDoan.update(
        { trangThai: "Chờ duyệt", ngayRutSo: null },
        { where: { idSoDoan: sodoanIds } },
      );
    }

    // Nếu mảng DV không rỗng nhưng ko tìm thấy SoDoan, create thủ công.
    // Do file insert_database dùng SD001, v.v ... nhưng cứ fallback:
    if (dvIds_without_sodoan.length > 0) {
      const lastSoDoan = await SoDoan.findOne({
        order: [["idSoDoan", "DESC"]],
      });
      let nextIdNumber = 1;
      if (lastSoDoan && lastSoDoan.idSoDoan.startsWith("SD")) {
        nextIdNumber = parseInt(lastSoDoan.idSoDoan.replace("SD", ""), 10) + 1;
      }

      for (const idDV of dvIds_without_sodoan) {
        const soDoanTonTai = await SoDoan.findOne({ where: { idDV } });
        if (soDoanTonTai) {
          await SoDoan.update(
            { trangThai: "Chờ duyệt", ngayRutSo: null },
            { where: { idSoDoan: soDoanTonTai.idSoDoan } },
          );
        } else {
          const idSoDoan = "SD" + String(nextIdNumber++).padStart(3, "0");
          await SoDoan.create({
            idSoDoan,
            idDV,
            ngayCap: new Date(),
            noiCap: null,
            trangThai: "Chờ duyệt",
            ngayRutSo: null,
          });
        }
      }
    }

    return true;
  },

  getSoDoanChoDuyet: async () => {
    // Trim values function inline copy
    const trimValues = (obj) => {
      const result = { ...obj };
      for (const key in result) {
        if (typeof result[key] === "string") {
          result[key] = result[key].trim();
        }
      }
      return result;
    };

    const soDoansInfo = await SoDoan.findAll({
      where: {
        trangThai: "Chờ duyệt",
      },
      include: [
        {
          model: DoanVien,
          as: "doanVien",
          include: [
            {
              model: ChiDoan,
              as: "chiDoan",
            },
          ],
        },
      ],
      order: [
        [
          { model: DoanVien, as: "doanVien" },
          { model: ChiDoan, as: "chiDoan" },
          "tenChiDoan",
          "ASC",
        ],
        [{ model: DoanVien, as: "doanVien" }, "hoTen", "ASC"],
      ],
    });

    const mappedData = soDoansInfo.map((sd) => {
      return {
        ...trimValues(sd.toJSON()),
        doanVien: {
          ...trimValues(sd.doanVien.toJSON()),
          chiDoan: trimValues(sd.doanVien.chiDoan.toJSON()),
        },
      };
    });

    // Gom nhóm (Group by ChiDoan)
    const grouped = {};
    for (const item of mappedData) {
      const cdId = item.doanVien.chiDoan.idChiDoan;
      if (!grouped[cdId]) {
        grouped[cdId] = {
          idChiDoan: cdId,
          tenChiDoan: item.doanVien.chiDoan.tenChiDoan,
          doanViens: [],
        };
      }
      grouped[cdId].doanViens.push(item);
    }

    // Convert object properties back to array
    return Object.values(grouped);
  },

  createSoDoan: async (idDV, ngayCap, noiCap) => {
     const tonTai = await SoDoan.findOne({ where: { idDV } });
     if (tonTai && tonTai.trangThai !== "Đã rút sổ") {
       throw new Error("Đoàn viên biểu đã có sổ đoàn!");
     }
     if (tonTai) {
       return await SoDoan.update({
          ngayCap: ngayCap || new Date(),
          noiCap: noiCap || null,
          trangThai: "Đã nộp sổ",
          ngayRutSo: null
       }, { where: { idSoDoan: tonTai.idSoDoan }});
     }

     const lastSoDoan = await SoDoan.findOne({ order: [["idSoDoan", "DESC"]] });
     let nextIdNumber = 1;
     if (lastSoDoan && lastSoDoan.idSoDoan.startsWith("SD")) {
        nextIdNumber = parseInt(lastSoDoan.idSoDoan.replace("SD", ""), 10) + 1;
     }
     
     const idSoDoan = "SD" + String(nextIdNumber).padStart(3, "0");
     return await SoDoan.create({
        idSoDoan,
        idDV,
        ngayCap: ngayCap || new Date(),
        noiCap: noiCap || "Đoàn trường cấp",
        trangThai: "Đã nộp sổ"
     });
  },

  duyetSoDoanLop: async (idSoDoans, trangThai) => {
    await SoDoan.update(
      { trangThai, ngayRutSo: null },
      { where: { idSoDoan: idSoDoans } },
    );
    return true;
  },

  getAllSoDoan: async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    return await SoDoan.findAndCountAll({
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      include: [
        {
          model: DoanVien,
          as: "doanVien",
          include: [
            {
              model: ChiDoan,
              as: "chiDoan",
              include: [{ model: Khoa, as: "khoa" }],
            },
          ],
        },
      ],
      order: [["idSoDoan", "ASC"]],
    });
  },

  getSoDoanById: async (idSoDoan) => {
    return await SoDoan.findOne({
      where: { idSoDoan },
      include: [
        {
          model: DoanVien,
          as: "doanVien",
          include: [
            {
              model: ChiDoan,
              as: "chiDoan",
              include: [{ model: Khoa, as: "khoa" }],
            },
          ],
        },
      ],
    });
  },

  updateTrangThai: async (idSoDoan, trangThai) => {
    const soDoan = await SoDoan.findByPk(idSoDoan);
    if (!soDoan) throw new Error("Không tìm thấy sổ đoàn");

    const updateData = { trangThai };
    if (trangThai === "Đã rút sổ") {
      updateData.ngayRutSo = new Date();
    } else {
      updateData.ngayRutSo = null;
    }

    await soDoan.update(updateData);
    return soDoan;
  },
};

module.exports = sodoanService;
