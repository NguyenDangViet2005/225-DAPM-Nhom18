import { useState } from "react";
import { Send, PlusCircle, Clock, CheckCircle } from "lucide-react";
import { MOCK_YEU_CAU_CHI_DOAN } from "@/data/mockHoatDong";
import { YEU_CAU_STATUS } from "@/constants";
import YeuCauTable from "./YeuCauTable";
import YeuCauForm from "./YeuCauForm";
import "./GuiYeuCauHoatDong.css";

const MY_CHI_DOAN = "23110CL1A";
const MY_NAME = "Nguyễn Văn Bí Thư";
const EMPTY_FORM = { tenHD: "", ngayDuKien: "", diaDiemDuKien: "", soLuongDuKien: "", moTa: "" };

const GuiYeuCauHoatDong = () => {
  const [activeTab, setActiveTab] = useState("danh-sach");
  const [list, setList] = useState(MOCK_YEU_CAU_CHI_DOAN);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.tenHD.trim()) e.tenHD = "Vui lòng nhập tên hoạt động";
    if (!form.ngayDuKien) e.ngayDuKien = "Vui lòng chọn ngày dự kiến";
    if (!form.diaDiemDuKien.trim()) e.diaDiemDuKien = "Vui lòng nhập địa điểm";
    if (!form.soLuongDuKien || Number(form.soLuongDuKien) < 1)
      e.soLuongDuKien = "Số lượng phải lớn hơn 0";
    if (!form.moTa.trim()) e.moTa = "Vui lòng nhập mô tả";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setList((prev) => [
      {
        idYC: `YCCD${String(prev.length + 1).padStart(3, "0")}`,
        tenHD: form.tenHD,
        idChiDoan: MY_CHI_DOAN,
        donViYeuCau: `Chi đoàn ${MY_CHI_DOAN}`,
        ngayDuKien: new Date(form.ngayDuKien).toISOString(),
        diaDiemDuKien: form.diaDiemDuKien,
        soLuongDuKien: Number(form.soLuongDuKien),
        moTa: form.moTa,
        trangThaiYC: YEU_CAU_STATUS.CHO_DUYET,
        ngayGui: new Date().toISOString(),
        nguoiGui: MY_NAME,
      },
      ...prev,
    ]);
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitted(true);
    setActiveTab("danh-sach");
  };

  const choDuyet = list.filter((y) => y.trangThaiYC === YEU_CAU_STATUS.CHO_DUYET).length;
  const daDuyet = list.filter((y) => y.trangThaiYC === YEU_CAU_STATUS.DA_DUYET).length;

  return (
    <div className="gyc-page">
      {/* Header */}
      <div className="gyc-header">
        <div>
          <h1 className="gyc-title">Gửi yêu cầu hoạt động</h1>
          <p className="gyc-subtitle">
            Chi đoàn <strong>{MY_CHI_DOAN}</strong> — Gửi lên Đoàn trường chờ phê duyệt
          </p>
        </div>
        <button
          className="gyc-btn gyc-btn--primary"
          onClick={() => {
            setSubmitted(false);
            setActiveTab("tao-moi");
          }}
        >
          <PlusCircle size={15} /> Tạo yêu cầu mới
        </button>
      </div>

      {/* Stat Cards */}
      <div className="gyc-stats">
        {[
          { icon: <Clock size={20} />, label: "Chờ duyệt", value: choDuyet, color: "#d97706" },
          { icon: <CheckCircle size={20} />, label: "Đã duyệt", value: daDuyet, color: "#16a34a" },
          { icon: <Send size={20} />, label: "Tổng đã gửi", value: list.length, color: "#004f9f" },
        ].map((s, i) => (
          <div key={i} className="gyc-stat-card">
            <div
              className="gyc-stat-card__icon"
              style={{ background: `${s.color}15`, color: s.color }}
            >
              {s.icon}
            </div>
            <div>
              <p className="gyc-stat-card__label">{s.label}</p>
              <p className="gyc-stat-card__value">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="gyc-tabs-bar">
        {[
          { key: "danh-sach", label: "Danh sách yêu cầu" },
          { key: "tao-moi", label: "Tạo yêu cầu mới" },
        ].map((t) => (
          <button
            key={t.key}
            className={`gyc-tab${activeTab === t.key ? " gyc-tab--active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB: DANH SÁCH */}
      {activeTab === "danh-sach" && (
        <>
          {submitted && (
            <div className="gyc-success-banner">
              <CheckCircle size={15} />
              Yêu cầu đã gửi thành công — đang chờ Đoàn trường phê duyệt.
            </div>
          )}
          <YeuCauTable list={list} setList={setList} />
        </>
      )}

      {/* TAB: TẠO MỚI */}
      {activeTab === "tao-moi" && (
        <YeuCauForm
          form={form}
          setForm={setForm}
          errors={errors}
          handleSubmit={handleSubmit}
          setActiveTab={setActiveTab}
          setErrors={setErrors}
          MY_CHI_DOAN={MY_CHI_DOAN}
          MY_NAME={MY_NAME}
        />
      )}
    </div>
  );
};

export default GuiYeuCauHoatDong;
