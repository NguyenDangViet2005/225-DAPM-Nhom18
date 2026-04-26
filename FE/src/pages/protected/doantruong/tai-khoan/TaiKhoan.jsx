import { useState, useEffect, useCallback } from "react";
import { UserPlus, RefreshCw } from "lucide-react";
import {
  getAllTaiKhoanAPI,
  createTaiKhoanAPI,
  updateTaiKhoanAPI,
  resetPasswordAPI,
  toggleTrangThaiAPI,
  getTaiKhoanStatsAPI,
  getAllVaiTroAPI,
  getDoanVienDropdownAPI,
  getKhoaDropdownAPI,
} from "@/apis/taikhoan.api";
import DataTableToolbar from "@/components/commons/DataTableToolbar/DataTableToolbar";
import Pagination from "@/components/commons/Pagination/Pagination";
import TaiKhoanStatsCards from "@/pages/protected/doantruong/tai-khoan/TaiKhoanStatsCards";
import TaiKhoanTable from "@/pages/protected/doantruong/tai-khoan/TaiKhoanTable";
import TaiKhoanFormModal from "@/pages/protected/doantruong/tai-khoan/TaiKhoanFormModal";
import TaiKhoanResetModal from "@/pages/protected/doantruong/tai-khoan/TaiKhoanResetModal";
import "./TaiKhoan.css";

/* ─── Initial form states ─────────────────────────────────── */
const EMPTY_FORM = {
  tenNguoiDung: "",
  matKhau: "",
  idVaiTro: "",
  idDV: "",
  idKhoa: "",
};
const EMPTY_RESET = { matKhauMoi: "", xacNhanMatKhau: "" };

const getVaiTroType = (idVaiTro, vaiTroList) => {
  const vt = vaiTroList.find((v) => v.idVaiTro === idVaiTro);
  if (!vt) return null;
  const name = vt.tenVaiTro.toLowerCase();
  if (
    name.includes("trường") ||
    name.includes("truong") ||
    name.includes("thường vụ")
  )
    return "DOANTRUONG";
  if (name.includes("khoa") || name.includes("liên chi")) return "DOANKHOA";
  return "DOANVIEN"; // bí thư lớp, đoàn viên
};

/* ─── Component ──────────────────────────────────────────── */
const TaiKhoan = () => {
  // ── Data ──
  const [accounts, setAccounts] = useState([]);
  const [stats, setStats] = useState({
    tongTaiKhoan: 0,
    dangHoatDong: 0,
    daKhoa: 0,
  });
  const [vaiTroList, setVaiTroList] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // ── Filter ──
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // ── Loading / error ──
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Dropdown data for modal ──
  const [doanVienList, setDoanVienList] = useState([]);
  const [khoaList, setKhoaList] = useState([]);
  const [isDropdownLoading, setIsDropdownLoading] = useState(false);

  // ── Modal: create / edit ──
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Modal: reset password ──
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetTarget, setResetTarget] = useState(null);
  const [resetForm, setResetForm] = useState(EMPTY_RESET);
  const [resetError, setResetError] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  // ── Fetch accounts ───────────────────────────────────────
  const fetchAccounts = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setError("");
      try {
        const res = await getAllTaiKhoanAPI({
          page,
          limit: pagination.limit,
          search: searchTerm,
          idVaiTro: roleFilter,
        });
        if (res.success) {
          setAccounts(res.data);
          setPagination(res.pagination);
        }
      } catch {
        setError("Không thể tải danh sách tài khoản. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, roleFilter, pagination.limit],
  );

  const fetchStats = useCallback(async () => {
    try {
      const r = await getTaiKhoanStatsAPI();
      if (r.success) setStats(r.data);
    } catch {}
  }, []);

  const fetchVaiTro = useCallback(async () => {
    try {
      const r = await getAllVaiTroAPI();
      if (r.success) setVaiTroList(r.data);
    } catch {}
  }, []);

  useEffect(() => {
    fetchVaiTro();
    fetchStats();
  }, [fetchVaiTro, fetchStats]);
  useEffect(() => {
    fetchAccounts(1);
  }, [searchTerm, roleFilter]); // eslint-disable-line

  // ── Toolbar filter options ───────────────────────────────
  const roleFilterOptions = [
    { value: "", label: "Tất cả vai trò" },
    ...vaiTroList.map((vt) => ({ value: vt.idVaiTro, label: vt.tenVaiTro })),
  ];

  // ── Fetch dropdown data khi mở modal ────────────────────
  const fetchDropdowns = useCallback(async (excludeIdDV = null) => {
    setIsDropdownLoading(true);
    try {
      const [dvRes, khoaRes] = await Promise.all([
        getDoanVienDropdownAPI(excludeIdDV),
        getKhoaDropdownAPI(),
      ]);
      if (dvRes.success) setDoanVienList(dvRes.data);
      if (khoaRes.success) setKhoaList(khoaRes.data);
    } catch {
    } finally {
      setIsDropdownLoading(false);
    }
  }, []);

  // ── Open create modal ─────────────────────────────────────
  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
    fetchDropdowns(null);
  };

  // ── Open edit modal ───────────────────────────────────────
  const openEdit = (tk) => {
    setEditTarget(tk);
    setForm({
      tenNguoiDung: tk.tenNguoiDung,
      matKhau: "",
      idVaiTro: tk.idVaiTro || "",
      idDV: tk.idDV || "",
      idKhoa: tk.idKhoa || "",
    });
    setFormError("");
    setShowModal(true);
    fetchDropdowns(tk.idDV || null);
  };

  // ── Submit create / edit ──────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.tenNguoiDung.trim()) {
      setFormError("Tên đăng nhập không được để trống");
      return;
    }
    if (!editTarget && !form.matKhau) {
      setFormError("Mật khẩu không được để trống");
      return;
    }
    if (!form.idVaiTro) {
      setFormError("Vui lòng chọn vai trò");
      return;
    }

    const roleType = getVaiTroType(form.idVaiTro, vaiTroList);

    // Validate theo vai trò
    if (roleType === "DOANKHOA" && !form.idKhoa) {
      setFormError("Đoàn Khoa phải chọn Khoa phụ trách");
      return;
    }
    if (roleType === "DOANVIEN" && !form.idDV) {
      setFormError("Bí thư/Đoàn viên phải nhập mã sinh viên");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editTarget) {
        const payload = {
          tenNguoiDung: form.tenNguoiDung.trim(),
          idVaiTro: form.idVaiTro.trim(),
        };
        if (roleType === "DOANVIEN") payload.idDV = form.idDV.trim();
        else payload.idDV = null;
        if (roleType === "DOANKHOA") payload.idKhoa = form.idKhoa.trim();
        else payload.idKhoa = null;
        await updateTaiKhoanAPI(editTarget.idUser, payload);
      } else {
        const payload = {
          tenNguoiDung: form.tenNguoiDung.trim(),
          matKhau: form.matKhau,
          idVaiTro: form.idVaiTro.trim(),
        };
        if (roleType === "DOANVIEN") {
          payload.idDV = form.idDV.trim();
        }
        if (roleType === "DOANKHOA") payload.idKhoa = form.idKhoa.trim();
        await createTaiKhoanAPI(payload);
      }
      setShowModal(false);
      fetchAccounts(pagination.page);
      fetchStats();
    } catch (err) {
      const resData = err?.response?.data;
      if (
        resData?.errors &&
        Array.isArray(resData.errors) &&
        resData.errors.length > 0
      ) {
        // Hiện chi tiết lỗi validation từ BE
        const details = resData.errors
          .map((e) => `• ${e.msg} (${e.path})`)
          .join("\n");
        setFormError(`${resData.message}:\n${details}`);
      } else {
        setFormError(resData?.message || "Có lỗi xảy ra, vui lòng thử lại");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Toggle trạng thái ─────────────────────────────────────
  const handleToggleStatus = async (tk) => {
    if (
      !window.confirm(
        `Bạn có chắc muốn ${tk.trangThai ? "khóa" : "mở khóa"} tài khoản "${tk.tenNguoiDung}"?`,
      )
    )
      return;
    try {
      await toggleTrangThaiAPI(tk.idUser);
      fetchAccounts(pagination.page);
      fetchStats();
    } catch {
      alert("Có lỗi khi thay đổi trạng thái tài khoản");
    }
  };

  // ── Reset password modal ──────────────────────────────────
  const openReset = (tk) => {
    setResetTarget(tk);
    setResetForm(EMPTY_RESET);
    setResetError("");
    setShowResetModal(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    if (!resetForm.matKhauMoi) {
      setResetError("Mật khẩu mới không được để trống");
      return;
    }
    if (resetForm.matKhauMoi.length < 6) {
      setResetError("Mật khẩu phải ít nhất 6 ký tự");
      return;
    }
    if (resetForm.matKhauMoi !== resetForm.xacNhanMatKhau) {
      setResetError("Mật khẩu xác nhận không khớp");
      return;
    }
    setIsResetting(true);
    try {
      await resetPasswordAPI(resetTarget.idUser, resetForm.matKhauMoi);
      setShowResetModal(false);
      alert(`Đặt lại mật khẩu cho "${resetTarget.tenNguoiDung}" thành công!`);
    } catch (err) {
      setResetError(err?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setIsResetting(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div className="tk-container">
      {/* ── Header ── */}
      <div className="tk-header">
        <h1 className="tk-title">Quản lý Tài khoản &amp; Phân quyền</h1>
        <div className="tk-actions">
          <button
            className="tk-btn-primary"
            id="btn-them-tai-khoan"
            onClick={openCreate}
          >
            <UserPlus size={18} /> Thêm tài khoản mới
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <TaiKhoanStatsCards stats={stats} />

      {/* ── Toolbar ── */}
      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm theo Tên đăng nhập..."
        filterValue={roleFilter}
        onFilterChange={setRoleFilter}
        filterOptions={roleFilterOptions}
      />

      {/* ── Error banner ── */}
      {error && (
        <div className="tk-error-banner">
          {error}
          <button onClick={() => fetchAccounts(1)}>
            <RefreshCw size={14} />
          </button>
        </div>
      )}

      {/* ── Table ── */}
      <TaiKhoanTable
        isLoading={isLoading}
        accounts={accounts}
        onEdit={openEdit}
        onReset={openReset}
        onToggleStatus={handleToggleStatus}
      />

      {/* ── Phân trang ── */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        onPageChange={fetchAccounts}
        loading={isLoading}
        itemLabel="tài khoản"
      />

      {/* ════════ MODAL: Thêm / Cập nhật ════════ */}
      <TaiKhoanFormModal
        show={showModal}
        editTarget={editTarget}
        form={form}
        setForm={setForm}
        formError={formError}
        isSubmitting={isSubmitting}
        vaiTroList={vaiTroList}
        doanVienList={doanVienList}
        khoaList={khoaList}
        isDropdownLoading={isDropdownLoading}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />

      {/* ════════ MODAL: Đặt lại mật khẩu ════════ */}
      <TaiKhoanResetModal
        show={showResetModal}
        resetTarget={resetTarget}
        resetForm={resetForm}
        setResetForm={setResetForm}
        resetError={resetError}
        isResetting={isResetting}
        onClose={() => setShowResetModal(false)}
        onSubmit={handleResetPassword}
      />
    </div>
  );
};

export default TaiKhoan;
