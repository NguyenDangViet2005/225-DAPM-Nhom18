import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { doanvienAPI } from "@/apis/doanvien.api";
import DataTableToolbar from "@/components/commons/DataTableToolbar/DataTableToolbar";
import StatsCards from "./StatsCards";
import DoanVienTable from "./DoanVienTable";
import DoanVienModal from "./DoanVienModal";
import DoanVienDetailModal from "./DoanVienDetailModal";
import "./QuanLyDoanVien.css";

const EMPTY_FORM = {
  idDV: "",
  hoTen: "",
  gioiTinh: "Nam",
  ngaySinh: "",
  SDT: "",
  email: "",
  CCCD: "",
  ngayCapCCCD: "",
  noiCapCCCD: "",
  diaChiThuongTru: "",
  diaChiTamTru: "",
  danToc: "",
  tonGiao: "",
  heDaoTao: "",
  trangThaiHoc: "Đang học",
  idChiDoan: "",
};

const QuanLyDoanVien = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  });
  const [stats, setStats] = useState({
    total: 0,
    male: 0,
    female: 0,
    withAccount: 0,
  });
  const [chiDoanList, setChiDoanList] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isEdit, setIsEdit] = useState(false);

  // State cho modal chi tiết
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedIdDV, setSelectedIdDV] = useState(null);

  const fetchDoanVien = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const res = await doanvienAPI.getAll(
          page,
          pagination.limit,
          searchTerm,
        );
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
    },
    [searchTerm, pagination.limit],
  );

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
    const newForm = { ...EMPTY_FORM };
    console.log("Creating new form:", newForm); // Debug log
    setForm(newForm);
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
      CCCD: dv.CCCD || "",
      ngayCapCCCD: dv.ngayCapCCCD ? dv.ngayCapCCCD.split("T")[0] : "",
      noiCapCCCD: dv.noiCapCCCD || "",
      diaChiThuongTru: dv.diaChiThuongTru || "",
      diaChiTamTru: dv.diaChiTamTru || "",
      danToc: dv.danToc || "",
      tonGiao: dv.tonGiao || "",
      heDaoTao: dv.heDaoTao || "",
      trangThaiHoc: dv.trangThaiHoc || "Đang học",
      idChiDoan: dv.idChiDoan ? dv.idChiDoan.trim() : "",
    });
    
    setShowModal(true);
  };

  const handleViewDetail = (idDV) => {
    setSelectedIdDV(idDV);
    setShowDetailModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...form,
      };
      
      console.log("Submit data:", submitData);
      
      if (isEdit) {
        await doanvienAPI.updateDoanVien(form.idDV, submitData);
        alert("Cập nhật dữ liệu thành công");
      } else {
        await doanvienAPI.createDoanVien(submitData);
        alert("Tạo đoàn viên thành công");
      }
      setShowModal(false);
      await Promise.all([fetchDoanVien(pagination.page), fetchStats()]);
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
      <StatsCards stats={stats} />

      {/* Toolbar */}
      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm kiếm theo mã sinh viên, tên, email..."
      />

      {/* Table */}
      <DoanVienTable
        key="doan-vien-table"
        data={data}
        loading={loading}
        pagination={pagination}
        onEdit={handleOpenEdit}
        onViewDetail={handleViewDetail}
        onPageChange={fetchDoanVien}
      />

      {/* Modal Form */}
      <DoanVienModal
        show={showModal}
        isEdit={isEdit}
        form={form}
        chiDoanList={chiDoanList}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        onChange={setForm}
      />

      {/* Modal Chi tiết */}
      <DoanVienDetailModal
        show={showDetailModal}
        idDV={selectedIdDV}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedIdDV(null);
        }}
      />
    </div>
  );
};

export default QuanLyDoanVien;
