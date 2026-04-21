import { useState, useEffect } from "react";
import { Check, X, Eye, Users } from "lucide-react";
import sodoanAPI from "@/apis/sodoan.api";
import "./SoDoan.css";

const SoDoanDuyet = () => {
  const [dataLop, setDataLop] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLop, setSelectedLop] = useState(null); // idChiDoan if examining a class
  const [listHocSinh, setListHocSinh] = useState([]);
  const [tenChiDoanHienTai, setTenChiDoanHienTai] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await sodoanAPI.getSoDoanChoDuyet();
      if (res.data.success) {
        setDataLop(res.data.data);
        if (selectedLop) {
          // If already viewing a class, refresh the student list inside
          const lopCapNhat = res.data.data.find(
            (lop) => lop.idChiDoan === selectedLop,
          );
          if (lopCapNhat) {
            setListHocSinh(lopCapNhat.doanViens);
          } else {
            // Class has no more pending, go back
            handleBackToGrid();
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewDetails = (lop) => {
    setSelectedLop(lop.idChiDoan);
    setTenChiDoanHienTai(lop.tenChiDoan);
    setListHocSinh(lop.doanViens);
  };

  const handleBackToGrid = () => {
    setSelectedLop(null);
    setTenChiDoanHienTai("");
    setListHocSinh([]);
  };

  const handleDuyet = async (idSoDoans) => {
    if (!window.confirm("Xác nhận duyệt tiếp nhận sổ đoàn cho sinh viên này?"))
      return;
    try {
      const res = await sodoanAPI.duyetSoDoanLop(idSoDoans, "Đã nộp sổ");
      if (res.data.success) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
      alert("Có lỗi khi thao tác");
    }
  };

  const handleTuChoi = async (idSoDoans) => {
    if (
      !window.confirm(
        "Từ chối nộp sổ Sổ đoàn cho sinh viên này? (Trạng thái sổ sẽ trở về Chưa nộp sổ để Bí thư có thể nộp lại)",
      )
    )
      return;
    try {
      const res = await sodoanAPI.duyetSoDoanLop(idSoDoans, "Chưa nộp sổ");
      if (res.data.success) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
      alert("Có lỗi khi thao tác");
    }
  };

  const handleDuyetTatCa = async () => {
    if (!listHocSinh.length) return;
    if (
      !window.confirm("Xác nhận duyệt toàn bộ sinh viên đang chờ của lớp này?")
    )
      return;

    const ids = listHocSinh.map((hs) => hs.idSoDoan);
    try {
      const res = await sodoanAPI.duyetSoDoanLop(ids, "Đã nộp sổ");
      if (res.data.success) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
      alert("Có lỗi khi duyệt tất cả");
    }
  };

  return (
    <div className="so-doan-content">
      {!selectedLop ? (
        // Màn hình 1: Hiển thị các khối Grid lớp
        <>
          <div className="so-doan-header">
            <h2 className="so-doan-content-title">
              Danh sách yêu cầu nộp sổ theo Chi đoàn
            </h2>
          </div>

          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : dataLop.length === 0 ? (
            <div className="nsd-alert success" style={{ margin: "20px 0" }}>
              <Check size={18} /> Hiện không có yêu cầu nộp/chờ duyệt nào.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              {dataLop.map((lop) => (
                <div
                  key={lop.idChiDoan}
                  className="so-doan-card"
                  style={{
                    padding: "20px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    border: "1px solid #e5e7eb",
                  }}
                  onClick={() => handleViewDetails(lop)}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Users size={20} color="#3b82f6" /> {lop.tenChiDoan}
                  </h3>
                  <p style={{ color: "#6b7280", fontSize: "14px" }}>
                    Số lượng chờ duyệt: <strong>{lop.doanViens.length}</strong>
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        // Màn hình 2: List Danh sách sinh viên ở trong lớp
        <>
          <div className="so-doan-header">
            <h2
              className="so-doan-content-title"
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <button
                onClick={handleBackToGrid}
                style={{
                  background: "#f3f4f6",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                ← Quay lại
              </button>
              Danh sách chờ duyệt - {tenChiDoanHienTai}
            </h2>
            <div className="so-doan-actions">
              <button
                className="btn-primary btn-primary--success"
                onClick={handleDuyetTatCa}
              >
                <Check size={18} />
                Duyệt tất cả của lớp
              </button>
            </div>
          </div>

          <div className="so-doan-card">
            <table className="so-doan-table">
              <thead>
                <tr>
                  <th>Mã SV</th>
                  <th>Họ tên</th>
                  <th>Ngày Sinh</th>
                  <th>Sổ đoàn (ID)</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listHocSinh.map((hs) => (
                  <tr key={hs.idSoDoan}>
                    <td>{hs.doanVien.idDV}</td>
                    <td style={{ fontWeight: "500" }}>{hs.doanVien.hoTen}</td>
                    <td>{hs.doanVien.ngaySinh}</td>
                    <td>{hs.idSoDoan}</td>
                    <td>
                      <div
                        className="action-btns"
                        style={{ display: "flex", gap: "8px" }}
                      >
                        <button
                          className="btn-icon btn-icon--success"
                          title="Duyệt tiếp nhận"
                          onClick={() => handleDuyet([hs.idSoDoan])}
                        >
                          <Check size={16} />
                        </button>
                        <button
                          className="btn-icon btn-icon--danger"
                          title="Từ chối/Bỏ qua"
                          onClick={() => handleTuChoi([hs.idSoDoan])}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default SoDoanDuyet;
