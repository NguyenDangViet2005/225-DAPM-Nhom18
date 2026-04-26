import { X, Save, Loader } from "lucide-react";
import SearchableSelect from "@/components/commons/SearchableSelect/SearchableSelect";

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
  return "DOANVIEN";
};

const TaiKhoanFormModal = ({
  show,
  editTarget,
  form,
  formError,
  isSubmitting,
  vaiTroList,
  doanVienList,
  khoaList,
  isDropdownLoading,
  onClose,
  onSubmit,
  setForm,
}) => {
  if (!show) return null;

  const roleType = getVaiTroType(form.idVaiTro, vaiTroList);

  const renderRoleFields = () => {
    if (!roleType || roleType === "DOANTRUONG") return null;

    if (roleType === "DOANKHOA") {
      return (
        <div className="tk-form-group">
          <label className="tk-form-label">
            Mã Khoa (Khoa phụ trách) <span className="req">*</span>
            {isDropdownLoading && (
              <Loader
                size={12}
                className="tk-spin"
                style={{ marginLeft: 6 }}
              />
            )}
          </label>
          <div
            className="tk-dv-input-row"
            style={{ gridTemplateColumns: "minmax(120px, 1fr) 2fr" }}
          >
            <input
              id="input-id-khoa"
              className="tk-form-input tk-dv-manual"
              type="text"
              placeholder="Mã (VD: CNTT)"
              value={form.idKhoa}
              onChange={(e) =>
                setForm((f) => ({ ...f, idKhoa: e.target.value }))
              }
              disabled={isDropdownLoading}
            />
            <div className="tk-dv-search">
              <select
                id="select-id-khoa"
                className="tk-form-input"
                value={form.idKhoa}
                onChange={(e) =>
                  setForm((f) => ({ ...f, idKhoa: e.target.value }))
                }
                disabled={isDropdownLoading}
                style={{ width: "100%" }}
              >
                <option value="">-- Hoặc chọn DS có sẵn --</option>
                {khoaList.map((k) => (
                  <option key={k.idKhoa} value={k.idKhoa}>
                    [{k.idKhoa}] {k.tenKhoa}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      );
    }

    if (roleType === "DOANVIEN") {
      return (
        <>
          <div className="tk-form-group" style={{ marginTop: "1rem" }}>
            <label className="tk-form-label">
              Liên kết Đoàn viên{" "}
              <span style={{ color: "#64748b", fontWeight: 400, textTransform: "none", fontSize: "0.72rem" }}>
                (Tìm kiếm theo mã SV để liên kết hoặc nhập mã SV mới)
              </span>
              {isDropdownLoading && <Loader size={12} className="tk-spin" style={{ marginLeft: 6 }} />}
            </label>
            <div className="tk-dv-input-row">
              <input
                id="input-id-dv"
                className="tk-form-input tk-dv-manual"
                type="text"
                placeholder="Nhập mã sinh viên..."
                value={form.idDV}
                onChange={(e) => setForm((f) => ({ ...f, idDV: e.target.value }))}
              />
              <div className="tk-dv-search">
                <SearchableSelect
                  id="searchable-id-dv"
                  value={form.idDV}
                  onChange={(val) => setForm((f) => ({ ...f, idDV: val }))}
                  disabled={isDropdownLoading}
                  placeholder="Hoặc tìm trong DS Đoàn viên..."
                  emptyText="Không tìm thấy đoàn viên chưa có tài khoản"
                  options={[
                    ...(editTarget?.idDV && !doanVienList.find((dv) => dv.idDV === editTarget.idDV)
                      ? [{ value: editTarget.idDV, label: editTarget.doanVien?.hoTen || editTarget.idDV, sub: "(Đoàn viên hiện tại)" }]
                      : []),
                    ...doanVienList.map((dv) => ({
                      value: dv.idDV,
                      label: dv.hoTen,
                      sub: [dv.chiDoan?.tenChiDoan, dv.idDV].filter(Boolean).join(" • "),
                    })),
                  ]}
                />
              </div>
            </div>
            <span className="tk-dv-hint">
              💡 Nhập mã sinh viên mới để tạo đoàn viên và tài khoản cùng lúc,
              hoặc tìm kiếm đoàn viên đã có để liên kết tài khoản.
            </span>
          </div>

          <div className="tk-form-group">
            <label className="tk-form-label">Chức vụ trong Chi đoàn <span className="req">*</span></label>
            <select
              className="tk-form-input"
              value={form.chucVu || ""}
              onChange={(e) => setForm((f) => ({ ...f, chucVu: e.target.value }))}
            >
              <option value="">-- Chọn chức vụ --</option>
              <option value="Bí thư">Bí thư</option>
              <option value="Phó bí thư">Phó bí thư</option>
              <option value="Đoàn viên">Đoàn viên</option>
            </select>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="tk-modal-overlay" onClick={onClose}>
      <div className="tk-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tk-modal-header">
          <h2>{editTarget ? "Cập nhật tài khoản" : "Thêm tài khoản mới"}</h2>
          <button className="tk-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="tk-modal-body">
          {formError && <div className="tk-form-error">{formError}</div>}

          <div className="tk-form-group">
            <label className="tk-form-label">
              Tên đăng nhập <span className="req">*</span>
            </label>
            <input
              id="input-ten-dang-nhap"
              className="tk-form-input"
              type="text"
              placeholder="Nhập tên đăng nhập..."
              value={form.tenNguoiDung}
              onChange={(e) =>
                setForm((f) => ({ ...f, tenNguoiDung: e.target.value }))
              }
            />
          </div>

          {!editTarget && (
            <div className="tk-form-group">
              <label className="tk-form-label">
                Mật khẩu <span className="req">*</span>
              </label>
              <input
                id="input-mat-khau"
                className="tk-form-input"
                type="password"
                placeholder="Ít nhất 6 ký tự..."
                value={form.matKhau}
                onChange={(e) =>
                  setForm((f) => ({ ...f, matKhau: e.target.value }))
                }
              />
            </div>
          )}

          <div className="tk-form-group">
            <label className="tk-form-label">
              Vai trò <span className="req">*</span>
            </label>
            <select
              id="select-vai-tro"
              className="tk-form-input"
              value={form.idVaiTro}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  idVaiTro: e.target.value,
                  idDV: "",
                  idKhoa: "",
                  chucVu: "",
                }))
              }
            >
              <option value="">-- Chọn vai trò --</option>
              {vaiTroList.map((vt) => (
                <option key={vt.idVaiTro} value={vt.idVaiTro}>
                  {vt.tenVaiTro}
                </option>
              ))}
            </select>
            {form.idVaiTro &&
              (() => {
                const rt = getVaiTroType(form.idVaiTro, vaiTroList);
                const hints = {
                  DOANTRUONG:
                    "✅ Đoàn Trường — không cần liên kết Đoàn viên hay Khoa",
                  DOANKHOA:
                    "🏫 Đoàn Khoa — vui lòng chọn Khoa phụ trách bên dưới",
                  DOANVIEN:
                    "🎓 Bí thư/Đoàn viên — vui lòng nhập mã sinh viên bên dưới (tự động tạo đoàn viên nếu chưa có)",
                };
                return hints[rt] ? (
                  <span className="tk-dv-hint">{hints[rt]}</span>
                ) : null;
              })()}
          </div>

          {renderRoleFields()}

          <div className="tk-modal-footer">
            <button
              type="button"
              className="tk-btn-secondary"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="tk-btn-primary"
              disabled={isSubmitting}
              id="btn-luu-tai-khoan"
            >
              {isSubmitting ? (
                <Loader size={16} className="tk-spin" />
              ) : (
                <Save size={16} />
              )}
              {editTarget ? "Lưu thay đổi" : "Tạo tài khoản"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaiKhoanFormModal;
