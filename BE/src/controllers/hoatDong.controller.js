const {sql, poolPromise} = require('../configs/db');
const hoatDongController={
    // API: Xem danh sách đoàn viên đăng ký 1 hoạt động cụ thể
    getDanhSachDangKy: async(req,res)=>{
        try {
            const {idHD}= req.params;
            const pool = await poolPromise;
            const result = await pool.request()
                            .input('idHD',sql.Char(15),idHD)
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
                success : false,
                message: "Lỗi Server khi truy vấn danh sách đăng ký"
            });
        }
    }
};
module.exports = hoatDongController;