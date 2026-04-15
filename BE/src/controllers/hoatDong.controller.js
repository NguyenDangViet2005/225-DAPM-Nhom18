const { sql, poolPromise } = require('../configs/db');

const hoatDongController = {
    // API: Xem danh sách đoàn viên đăng ký 1 hoạt động cụ thể
    getDanhSachDangKy: async (req, res) => {
        try {
            const { idHD } = req.params;
            const pool = await poolPromise;
            const result = await pool.request()
                .input('idHD', sql.Char(15), idHD)
                .query(`
                    SELECT 
                        dv.idDV AS maSV,
                        dv.hoTen AS hoTen,
                        cd.tenChiDoan AS tenChiDoan,
                        dk.ngayDangKi AS ngayDangKy,
                        dk.trangThaiDuyet AS trangThai
                    FROM DoanVienDangKi dk
                    JOIN DoanVien dv ON dk.idDV = dv.idDV
                    JOIN ChiDoan cd ON dv.idChiDoan = cd.idChiDoan
                    WHERE dk.idHD = @idHD
                `);
            res.status(200).json({
                success: true,
                data: result.recordset
            });
        } catch (error) {
            console.error("Lỗi getDanhSachDangKy:", error);
            res.status(500).json({
                success: false,
                message: "Lỗi Server khi truy vấn danh sách đăng ký"
            });
        }
    },

    // API: Lấy danh sách hoạt động theo đơn vị tổ chức
    getDanhSachHoatDong: async (req, res) => {
        try {
            const { donViToChuc } = req.query; 
            const pool = await poolPromise;
            let query = `
                SELECT idHD, tenHD, donViToChuc, trangThaiHD, ngayToChuc,
                       soLuongMax, soLuongDaDK
                FROM HoatDongDoan
            `;
            const request = pool.request();
            if (donViToChuc) {
                query += ` WHERE donViToChuc = @donViToChuc`;
                request.input('donViToChuc', sql.NVarChar(50), donViToChuc);
            }
            query += ` ORDER BY ngayToChuc DESC`;
            const result = await request.query(query);
            res.status(200).json({ success: true, data: result.recordset });
        } catch (error) {
            console.error("Lỗi getDanhSachHoatDong:", error);
            res.status(500).json({ success: false, message: "Lỗi Server" });
        }
    },

    // API: Duyệt hoặc Từ chối sinh viên đăng ký
    duyetDangKy: async (req, res) => {
        try {
            const { idHD } = req.params;
            const { maSV, trangThai, lyDo } = req.body;

            if (!maSV || !trangThai) {
                return res.status(400).json({ success: false, message: "Thiếu dữ liệu maSV hoặc trangThai" });
            }

            const pool = await poolPromise;
            const result = await pool.request()
                .input('idHD', sql.Char(15), idHD)
                .input('maSV', sql.Char(15), maSV)
                .input('trangThai', sql.NVarChar(50), trangThai) 
                .input('lyDo', sql.NVarChar(500), lyDo || null) 
                .query(`
                    UPDATE DoanVienDangKi
                    SET 
                        trangThaiDuyet = @trangThai,
                        lyDoTuChoi = @lyDo
                    WHERE idHD = @idHD AND idDV = @maSV
                `);

            if (result.rowsAffected[0] == 0) {
                return res.status(404).json({ success: false, message: "Không tìm thấy thông tin đăng ký này" });
            }

            res.status(200).json({
                success: true,
                message: `Đã cập nhật trạng thái thành: ${trangThai}`
            });
        } catch (error) {
            console.error("Lỗi duyetDangKy:", error);
            res.status(500).json({ success: false, message: "Lỗi Server khi duyệt" });
        }
    }
};

module.exports = hoatDongController;