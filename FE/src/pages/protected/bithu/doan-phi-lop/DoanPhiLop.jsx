import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "@/contexts/AuthContext";
import { getDoanPhiStatsAPI, getDoanPhiAPI, createPhieuThuAPI, getPhieuThuAPI } from "@/apis/doanphi.api";
import { PAGE_SIZE } from "@/constants";
import { getErrorMessage } from "@/utils";
import DoanPhiLopStats from "./DoanPhiLopStats";
import DoanPhiLopTable from "./DoanPhiLopTable";
import DoanPhiLopModal from "./DoanPhiLopModal";
import PhieuThuTable from "./PhieuThuTable";
import "./DoanPhiLop.css";

const DoanPhiLop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const myChiDoan = user?.idChiDoan || "Unknown";

  const activeTab = location.pathname.endsWith("/gui")
    ? "gui"
    : location.pathname.endsWith("/lich-su")
      ? "lich-su"
      : "danh-sach";

  const handleTabChange = (tab) => {
    if (tab === "gui") navigate("/bi-thu/doan-phi-lop/gui");
    else if (tab === "lich-su") navigate("/bi-thu/doan-phi-lop/lich-su");
    else navigate("/bi-thu/doan-phi-lop/lap-danh-sach");
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [checked, setChecked] = useState({});
  const [page, setPage] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);

  const [stats, setStats] = useState({
    tongDoanVien: 0,
    daDong: 0,
    chuaDong: 0,
    dangChoDuyet: 0,
    tongDaThu: 0,
    tongPhaiThu: 0,
    namHoc: "",
    soTien: 0,
    tyLe: 0,
  });
  const [doanPhiList, setDoanPhiList] = useState([]);
  const [phieuThuList, setPhieuThuList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    if (!myChiDoan || myChiDoan === "Unknown") return;
    try {
      const res = await getDoanPhiStatsAPI({ idChiDoan: myChiDoan });
      if (res.success) setStats(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchList = async () => {
    if (!myChiDoan || myChiDoan === "Unknown") return;
    setLoading(true);
    try {
      const res = await getDoanPhiAPI({
        search: searchTerm,
        trangThai: statusFilter,
        idChiDoan: myChiDoan,
        page,
        limit: PAGE_SIZE.DEFAULT,
      });
      if (res.success) {
        setDoanPhiList(res.data);
        setTotalPages(res.pagination?.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPhieuThu = async () => {
    setLoading(true);
    try {
      const res = await getPhieuThuAPI();
      if (res.success) setPhieuThuList(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [myChiDoan]);

  useEffect(() => {
    if (activeTab === "danh-sach") {
      fetchList();
    } else if (activeTab === "lich-su") {
      fetchPhieuThu();
    }
  }, [searchTerm, statusFilter, page, myChiDoan, activeTab]);

  const toggleCheck = (idDoanPhi) =>
    setChecked((prev) => ({ ...prev, [idDoanPhi]: !prev[idDoanPhi] }));

  const handleSearch = (v) => {
    setSearchTerm(v);
    setPage(1);
  };

  const handleFilter = (v) => {
    setStatusFilter(v);
    setPage(1);
  };

  const availableToSelect = doanPhiList;
  const isAllSelected =
    availableToSelect.length > 0 &&
    availableToSelect.every((p) => checked[p.idDoanPhi]);

  const toggleSelectAll = () => {
    const newChecked = { ...checked };
    if (isAllSelected) {
      availableToSelect.forEach((p) => (newChecked[p.idDoanPhi] = false));
    } else {
      availableToSelect.forEach((p) => (newChecked[p.idDoanPhi] = true));
    }
    setChecked(newChecked);
  };

  const selectedList = Object.keys(checked).filter((k) => checked[k]);
  const selectedCount = selectedList.length;
  const moneyToSubmit = selectedCount * stats.soTien;

  const handleSubmit = async () => {
    if (selectedCount === 0)
      return alert("Vui lòng chọn ít nhất 1 đoàn viên đã nộp phí!");
    if (!uploadedFile)
      return alert("Vui lòng đính kèm file chứng từ (ảnh hoặc PDF)!");

    try {
      const res = await createPhieuThuAPI({
        listIdDoanPhi: selectedList,
        file: uploadedFile,
      });
      if (res.success) {
        alert("Gửi danh sách nộp thành công! Vui lòng chờ Đoàn trường duyệt.");
        setChecked({});
        setUploadedFile(null);
        fetchStats();
        fetchList();
        handleTabChange("danh-sach");
      }
    } catch (e) {
      alert(getErrorMessage(e));
    }
  };

  const handleLapDanhSach = () => {
    if (selectedCount === 0) {
      return alert("Vui lòng tích chọn đoàn viên chưa đóng phí để lập danh sách!");
    }
    handleTabChange("gui");
  };

  return (
    <div className="dpl-page">
      {/* Page Title */}
      <div className="dpl-page-header">
        <div>
          <h1 className="dpl-page-title">Đoàn phí lớp</h1>
          <p className="dpl-page-sub">
            Quản lý thu đoàn phí chi đoàn &nbsp;·&nbsp; Chi đoàn:{" "}
            <strong>
              {myChiDoan !== "Unknown" ? user?.chiDoan?.tenChiDoan || myChiDoan : "..."}
            </strong>
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <DoanPhiLopStats stats={stats} />

      {/* Tabs */}
      <div className="dpl-tabs-bar">
        <button
          className={`dpl-tab${activeTab === "danh-sach" ? " dpl-tab--active" : ""}`}
          onClick={() => handleTabChange("danh-sach")}
        >
          Lập danh sách thu
        </button>
        <button
          className={`dpl-tab${activeTab === "gui" ? " dpl-tab--active" : ""}`}
          onClick={() => handleTabChange("gui")}
        >
          Gửi danh sách nộp
        </button>
        <button
          className={`dpl-tab${activeTab === "lich-su" ? " dpl-tab--active" : ""}`}
          onClick={() => handleTabChange("lich-su")}
        >
          Lịch sử nộp
        </button>
      </div>

      {/* TAB: DANH SÁCH THU */}
      {activeTab === "danh-sach" && (
        <DoanPhiLopTable
          doanPhiList={doanPhiList}
          loading={loading}
          checked={checked}
          toggleCheck={toggleCheck}
          isAllSelected={isAllSelected}
          toggleSelectAll={toggleSelectAll}
          availableToSelect={availableToSelect}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          statusFilter={statusFilter}
          handleFilter={handleFilter}
          selectedCount={selectedCount}
          handleLapDanhSach={handleLapDanhSach}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          soTien={stats.soTien}
        />
      )}

      {/* TAB: GỬI DANH SÁCH NỘP */}
      {activeTab === "gui" && (
        <DoanPhiLopModal
          selectedCount={selectedCount}
          moneyToSubmit={moneyToSubmit}
          namHoc={stats.namHoc}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          handleSubmit={handleSubmit}
          handleTabChange={handleTabChange}
        />
      )}

      {/* TAB: LỊCH SỬ NỘP */}
      {activeTab === "lich-su" && (
        <PhieuThuTable phieuThuList={phieuThuList} loading={loading} />
      )}
    </div>
  );
};

export default DoanPhiLop;
