import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, RefreshCw, Users, UserCheck, UserX, ChevronLeft, ChevronRight } from "lucide-react";
import { doanvienAPI } from "@/apis/doanvien.api";
import DataTableToolbar from "@/components/commons/DataTableToolbar/DataTableToolbar";
import "./QuanLyDoanVien.css";

const EMPTY_FORM = { idDV: "", hoTen: "", gioiTinh: "Nam", ngaySinh: "", SDT: "", email: "", diaChi: "", idChiDoan: "" };

const QuanLyDoanVien = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalItems: 0, totalPages: 1 });
  const [stats, setStats] = useState({ total: 0, male: 0, female: 0, withAccount: 0 });
  const [chiDoanList, setChiDoanList] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isEdit, setIsEdit] = useState(false);

  const fetchDoanVien = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await doanvienAPI.getAll(page, pagination.limit, searchTerm);
      if (res.success) {
        setData(res.data);
        setPagination({
          page: res.pagination.currentPage,
          limit: pagination.limit,
          totalItems: res.pagination.totalItems,
          totalPages: res.pagination.totalPages,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, pagination.limit]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await doanvienAPI.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchChiDoan = useCallback(async () => {
    try {
      const res = await doanvienAPI.getChiDoanList();
      if (res.success) {
        setChiDoanList(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchDoanVien(1);
    fetchStats();
    fetchChiDoan();
  }, [searchTerm]); // eslint-disable-line

  const handleOpenCreate = () => {
    setIsEdit(false);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const handleOpenEdit = (dv) => {
    setIsEdit(true);
    setForm({
      idDV: dv.idDV ? dv.idDV.trim() : "",
      hoTen: dv.hoTen || "",
      gioiTinh: dv.gioiTinh || "Nam",
      ngaySinh: dv.ngaySinh ? dv.ngaySinh.split("T")[0] : "",
      SDT: dv.SDT || "",
      email: dv.email || "",
      diaChi: dv.diaChi || "",
      idChiDoan: dv.idChiDoan ? dv.idChiDoan.trim() : ""
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await doanvienAPI.updateDoanVien(form.idDV, form);
        alert("Cập nhật dữ liệu thành công");
      } else {
        await doanvienAPI.createDoanVien(form);
        alert("Tạo đoàn viên thành công");
      }
      setShowModal(false);
      // Refresh both data and stats after create/update
      await Promise.all([
        fetchDoanVien(pagination.page),
        fetchStats()
      ]);
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="ql-dv-container">
      {/* Header */}
      <div className="ql-dv-header">
        <h1 className="ql-dv-title">Quản lý Đoàn viên</h1>
        <button className="ql-dv-btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} /> Thêm Đoàn viên Mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="ql-dv-stats">
        <div className="ql-dv-stat-card primary">
          <div className="ql-dv-stat-label">Tổng đoàn viên</div>
          <div className="ql-dv-stat-value">{stats.total}</div>
          <Users size={48} className="ql-dv-stat-icon" />
        </div>
        <div className="ql-dv-stat-card info">
          <div className="ql-dv-stat-label">Nam</div>
          <div className="ql-dv-stat-value">{stats.male}</div>
          <UserCheck size={48} className="ql-dv-stat-icon" />
        </div>
        <div className="ql-dv-stat-card warning">
          <div className="ql-dv-stat-label">Nữ</div>
          <div className="ql-dv-stat-value">{stats.female}</div>
          <UserCheck size={48} className="ql-dv-stat-icon" />
        </div>
        <div className="ql-dv-stat-card success">
          <div className="ql-dv-stat-label">Đã có tài khoản</div>
          <div className="ql-dv-stat-value">{stats.withAccount}</div>
          <UserX size={48} className="ql-dv-stat-icon" />
        </div>
      </div>

      {/* Toolbar */}
      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm kiếm theo mã sinh viên, tên, email..."
      />

      {/* Table */}
      <div className="ql-dv-card">
        <table className="ql-dv-table">
          <thead>
            <tr>
              <th>Mã sinh viên</th>
              <th>Họ và tên</th>
              <th>Chi đoàn</th>
              <th>Giới tính</th>
              <th>Ngày sinh</th>
              <th>Liên hệ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="ql-dv-loading">
                  <RefreshCw size={32} className="ql-dv-spin" />
                  <span>Đang tải dữ liệu...</span>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={7} className="ql-dv-empty">
                  Không tìm thấy đoàn viên nào
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.idDV}>
                  <td>
                    <strong style={{ color: "#004f9f" }}>{item.idDV}</strong>
                  </td>
                  <td>
                    <span className="ql-dv-user-name">{item.hoTen}</span>
                  </td>
                  <td>
                    {item.chiDoan ? (
                      <div>
                        <div className="ql-dv-user-name" style={{ fontSize: "0.875rem" }}>
                          {item.chiDoan.tenChiDoan}
                        </div>
                        {item.chiDoan.khoa && (
                          <span className="ql-dv-user-email">
                            {item.chiDoan.khoa.tenKhoa}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: "#94a3b8", fontStyle: "italic" }}>
                        Chưa có
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`ql-dv-badge ${item.gioiTinh === "Nam" ? "male" : "female"}`}>
                      {item.gioiTinh}
                    </span>
                  </td>
                  <td>
                    {item.ngaySinh
                      ? new Date(item.ngaySinh).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                  <td>
                    <div style={{ fontSize: "0.875rem" }}>
                      {item.SDT && <div>📱 {item.SDT}</div>}
                      {item.email && <div className="ql-dv-user-email">✉️ {item.email}</div>}
                      {!item.SDT && !item.email && "—"}
                    </div>
                  </td>
                  <td>
                    <button
                      className="ql-dv-btn-icon"
                      onClick={() => handleOpenEdit(item)}
                      title="Chỉnh sửa"
                    >
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="ql-dv-pagination">
            <span className="ql-dv-page-info">
              Hiển thị {data.length} / {pagination.totalItems} đoàn viên
            </span>
            <div className="ql-dv-page-controls">
              <button
                className="ql-dv-page-btn"
                disabled={pagination.page <= 1}
                onClick={() => fetchDoanVien(pagination.page - 1)}
              >
                <ChevronLeft size={16} /> Trước
              </button>
              <div className="ql-dv-page-number">
                Trang {pagination.page} / {pagination.totalPages}
              </div>
              <button
                className="ql-dv-page-btn"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchDoanVien(pagination.page + 1)}
              >
                Sau <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="ql-dv-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="ql-dv-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="ql-dv-modal-title">
              {isEdit ? "Cập nhật thông tin" : "Thêm đoàn viên mới"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="ql-dv-form-group">
                <input
                  required
                  disabled={isEdit}
                  type="text"
                  placeholder="Mã đoàn viên (MSSV) *"
                  value={form.idDV}
                  onChange={(e) => setForm({ ...form, idDV: e.target.value })}
                  className="ql-dv-form-input"
                />
                <input
                  required
                  type="text"
                  placeholder="Họ và tên *"
                  value={form.hoTen}
                  onChange={(e) => setForm({ ...form, hoTen: e.target.value })}
                  className="ql-dv-form-input"
                />

                <div className="ql-dv-form-row">
                  <select
                    value={form.gioiTinh}
                    onChange={(e) => setForm({ ...form, gioiTinh: e.target.value })}
                    className="ql-dv-form-input"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                  <input
                    type="date"
                    placeholder="Ngày sinh"
                    value={form.ngaySinh}
                    onChange={(e) => setForm({ ...form, ngaySinh: e.target.value })}
                    className="ql-dv-form-input"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Số điện thoại"
                  value={form.SDT}
                  onChange={(e) => setForm({ ...form, SDT: e.target.value })}
                  className="ql-dv-form-input"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="ql-dv-form-input"
                />

                <select
                  value={form.idChiDoan.trim()}
                  onChange={(e) => setForm({ ...form, idChiDoan: e.target.value })}
                  className="ql-dv-form-input"
                >
                  <option value="">-- Chọn chi đoàn (lớp) --</option>
                  {chiDoanList.map((cd) => (
                    <option key={cd.idChiDoan} value={cd.idChiDoan.trim()}>
                      {cd.tenChiDoan} {cd.khoa && `- ${cd.khoa.tenKhoa}`}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Địa chỉ thường trú"
                  value={form.diaChi}
                  onChange={(e) => setForm({ ...form, diaChi: e.target.value })}
                  className="ql-dv-form-input"
                />
              </div>

              <div className="ql-dv-modal-footer">
                <button
                  type="button"
                  className="ql-dv-btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="ql-dv-btn-save">
                  {isEdit ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyDoanVien;
