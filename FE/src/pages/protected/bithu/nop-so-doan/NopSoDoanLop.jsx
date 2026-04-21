import { useState, useEffect } from "react";
import sodoanAPI from "@/apis/sodoan.api";
import { CheckSquare, Square, UserCheck, BookOpen, AlertCircle, CheckCircle, Search } from "lucide-react";
import "./NopSoDoanLop.css";

const NopSoDoanLop = () => {
  const [danhSach, setDanhSach] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDanhSach = async () => {
    setLoading(true);
    try {
      const response = await sodoanAPI.getLopSoDoan();
      const res = response.data;
      if (res.success) {
        setDanhSach(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Không thể tải danh sách sổ đoàn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDanhSach();
  }, []);

  const handleToggleSelect = (item) => {
    // Nếu item có idSoDoan thì dùng idSoDoan, không thì dùng idDV
    const idToToggle = item.idSoDoan || item.idDV;
    setSelectedIds((prev) =>
      prev.includes(idToToggle)
        ? prev.filter((id) => id !== idToToggle)
        : [...prev, idToToggle]
    );
  };

  const handleSelectAll = (filteredList) => {
    const chuaNopIds = filteredList
      .filter((s) => s.trangThai === "Chưa nộp sổ")
      .map((s) => s.idSoDoan || s.idDV);

    if (selectedIds.length === chuaNopIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(chuaNopIds);
    }
  };

  const handleSubmit = async () => {
    if (selectedIds.length === 0) return;
    
    // confirm
    if (!window.confirm(`Bạn có chắc chắn gửi ${selectedIds.length} sổ đoàn này đi để chờ duyệt?`)) {
      return;
    }

    try {
      // Đối với mock data/thực tế, có thể cần đảm bảo backend xử lý tạo mới SoDoan nếu null
      const response = await sodoanAPI.submitLopSoDoan(selectedIds);
      const res = response.data;
      if (res.success) {
        setSuccessMsg("Gửi danh sách nộp sổ thành công, đang chờ đoàn trường duyệt.");
        setSelectedIds([]);
        fetchDanhSach();
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi nộp sổ đoàn.");
    }
  };

  const currentList = danhSach.filter((item) =>
    item.doanVien?.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.doanVien?.idDV.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filterChuaNop = currentList.filter(s => s.trangThai === "Chưa nộp sổ");
  const isAllSelected = selectedIds.length > 0 && selectedIds.length === filterChuaNop.length;

  return (
    <div className="nop-so-doan-lop-container">
      <div className="nsd-header">
        <h1 className="nsd-title"><BookOpen size={24} /> Nộp sổ đoàn lớp</h1>
        <p className="nsd-subtitle">Quản lý và cập nhật danh sách nộp sổ đoàn của chi đoàn</p>
      </div>

      {error && (
        <div className="nsd-alert error">
          <AlertCircle size={18} /> <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="nsd-alert success">
          <CheckCircle size={18} /> <span>{successMsg}</span>
        </div>
      )}

      <div className="nsd-card">
        <div className="nsd-toolbar">
          <div className="nsd-search">
            <Search size={18} className="nsd-search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã SV, họ tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="nsd-btn-submit"
            onClick={handleSubmit}
            disabled={selectedIds.length === 0 || loading}
          >
            <UserCheck size={18} />
            Đã nộp, gửi duyệt ({selectedIds.length})
          </button>
        </div>

        <div className="nsd-table-wrapper">
          <table className="nsd-table">
            <thead>
              <tr>
                <th width="50" style={{ textAlign: "center" }}>
                  <button 
                    className="nsd-check-btn" 
                    onClick={() => handleSelectAll(currentList)}
                    disabled={filterChuaNop.length === 0}
                  >
                    {isAllSelected && filterChuaNop.length > 0 ? (
                      <CheckSquare size={18} color="#2196f3" />
                    ) : (
                      <Square size={18} />
                    )}
                  </button>
                </th>
                <th>Mã SV</th>
                <th>Họ Tên</th>
                <th>Ngày Sinh</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="nsd-text-center">Đang tải danh sách...</td>
                </tr>
              ) : currentList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="nsd-text-center">Không tìm thấy sinh viên nào.</td>
                </tr>
              ) : (
                currentList.map((item) => {
                  const checkId = item.idSoDoan || item.idDV;
                  const isChecked = selectedIds.includes(checkId);
                  
                  // Chỉ hiện các trạng thái khác "Chưa nộp sổ" dưới dạng text, không thể chọn
                  const isOtherStatus = item.trangThai !== "Chưa nộp sổ";

                  return (
                    <tr key={checkId} className={isChecked ? "nsd-row-selected" : ""}>
                      <td style={{ textAlign: "center" }}>
                        {isOtherStatus ? (
                          <div className="nsd-check-disabled" title={item.trangThai}>
                            <CheckSquare size={18} color="#aaa" />
                          </div>
                        ) : (
                          <button 
                            className="nsd-check-btn"
                            onClick={() => handleToggleSelect(item)}
                          >
                            {isChecked ? (
                              <CheckSquare size={18} color="#2196f3" />
                            ) : (
                              <Square size={18} />
                            )}
                          </button>
                        )}
                      </td>
                      <td>{item.doanVien?.idDV || item.idDV || "-"}</td>
                      <td className="nsd-fw-bold">{item.doanVien?.hoTen || "-"}</td>
                      <td>
                        {item.doanVien?.ngaySinh 
                          ? new Date(item.doanVien?.ngaySinh).toLocaleDateString("vi-VN") 
                          : "-"}
                      </td>
                      <td>
                        <span className={`nsd-badge nsd-badge--${item.trangThai === "Chưa nộp sổ" ? "pending" : "success"}`}>
                          {item.trangThai || "Chưa nộp sổ"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NopSoDoanLop;
