import { useState, useEffect } from "react";
import { Send, PlusCircle, Clock, CheckCircle } from "lucide-react";
import { hoatdongAPI } from "@/apis/hoatdong.api";
import { useAuth } from "@/hooks/useAuth";
import YeuCauTable from "./YeuCauTable";
import YeuCauForm from "./YeuCauForm";
import "./GuiYeuCauHoatDong.css";

const EMPTY_FORM = { tenHD: "", ngayDuKien: "", diaDiemDuKien: "", soLuongDuKien: "", moTa: "" };

const GuiYeuCauHoatDong = () => {
  const { user } = useAuth();
  const MY_CHI_DOAN = user?.chiDoan?.tenChiDoan || user?.idChiDoan || "Chi đoàn";
  const MY_NAME = user?.hoTen || "Bí thư";

  const [activeTab, setActiveTab] = useState("danh-sach");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      // Lấy tất cả hoạt động Chi đoàn
      const res = await hoatdongAPI.getAllChidoanActivities({ limit: 1000 });
      if (res.success) {
        // Lọc các hoạt động do Chi đoàn hiện tại tạo
        const myActivities = res.data.filter(a => a.idChiDoan === user?.idChiDoan);
        
        // Map sang format của frontend
        const mappedData = myActivities.map(a => ({
          idYC: a.idHD,
          tenHD: a.tenHD,
          idChiDoan: a.idChiDoan,
          donViYeuCau: a.donViToChuc || `Chi đoàn ${MY_CHI_DOAN}`,
          ngayDuKien: a.ngayToChuc,
          diaDiemDuKien: a.diaDiem,
          soLuongDuKien: a.soLuongMax,
          moTa: a.moTa,
          trangThaiYC: a.trangThaiHD || "Chưa duyệt",
          ngayGui: a.ngayToChuc,
          nguoiGui: MY_NAME,
        }));
        setList(mappedData);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách yêu cầu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.idChiDoan) {
      fetchActivities();
    }
  }, [user]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      const payload = {
        tenHD: form.tenHD,
        moTa: form.moTa,
        ngayToChuc: form.ngayDuKien,
        diaDiem: form.diaDiemDuKien,
        soLuongMax: Number(form.soLuongDuKien),
        diemHD: 5, // Điểm mặc định
        donViToChuc: `Chi đoàn ${MY_CHI_DOAN}`,
      };

      let res;
      if (editingId) {
        // Cập nhật
        res = await hoatdongAPI.updateActivity(editingId, payload);
      } else {
        // Tạo mới
        payload.idHD = `HD${Date.now().toString().slice(-8)}`;
        res = await hoatdongAPI.createActivity(payload);
      }

      if (res.success) {
        setForm(EMPTY_FORM);
        setErrors({});
        setEditingId(null);
        setSubmitted(true);
        setActiveTab("danh-sach");
        fetchActivities(); // Tải lại danh sách
      } else {
        alert(res.message || "Gửi yêu cầu thất bại");
      }
    } catch (error) {
      console.error("Lỗi tạo/cập nhật yêu cầu:", error);
      alert("Đã xảy ra lỗi khi gửi yêu cầu.");
    }
  };

  const handleEdit = (yc) => {
    setEditingId(yc.idYC);
    setForm({
      tenHD: yc.tenHD,
      ngayDuKien: yc.ngayDuKien,
      diaDiemDuKien: yc.diaDiemDuKien,
      soLuongDuKien: yc.soLuongDuKien,
      moTa: yc.moTa || "",
    });
    setSubmitted(false);
    setActiveTab("tao-moi");
  };

  const handleDelete = async (idYC) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy yêu cầu này không?")) {
      try {
        const res = await hoatdongAPI.deleteActivity(idYC);
        if (res.success) {
          fetchActivities();
        } else {
          alert(res.message || "Hủy thất bại");
        }
      } catch (error) {
        console.error("Lỗi hủy yêu cầu:", error);
        alert("Đã xảy ra lỗi khi hủy yêu cầu.");
      }
    }
  };

  const choDuyet = list.filter((y) => y.trangThaiYC === "Chưa duyệt").length;
  const daDuyet = list.filter((y) => y.trangThaiYC === "Đã duyệt").length;

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
            setForm(EMPTY_FORM);
            setEditingId(null);
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
          { key: "tao-moi", label: editingId ? "Cập nhật yêu cầu" : "Tạo yêu cầu mới" },
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
          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>Đang tải danh sách...</div>
          ) : (
            <YeuCauTable list={list} onDelete={handleDelete} onEdit={handleEdit} />
          )}
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
