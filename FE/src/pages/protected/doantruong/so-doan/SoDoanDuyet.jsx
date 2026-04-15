import { useState } from "react";
import { Check, X, Eye } from "lucide-react";
import DataTableToolbar from "@/components/commons/DataTableToolbar/DataTableToolbar";
import "./SoDoan.css";

const SoDoanDuyet = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dữ liệu giả lập (Mock) cho giao diện
  const mockData = [
    {
      id: "SD-TEMP-001",
      idDV: "23115053122204",
      hoTen: "Trần Văn Tạm",
      chiDoan: "23T1",
      khoa: "Khoa Công nghệ Số",
      trangThai: "Chờ duyệt",
      ngayYeuCau: "14/04/2026",
    },
    {
      id: "SD-TEMP-002",
      idDV: "23115053122205",
      hoTen: "Nguyễn Thị Thử",
      chiDoan: "23D2",
      khoa: "Khoa Điện - Điện tử",
      trangThai: "Chờ duyệt",
      ngayYeuCau: "15/04/2026",
    },
  ];

  return (
    <div className="so-doan-content">
      <div className="so-doan-header">
        <h2 className="so-doan-content-title">
          Danh sách yêu cầu nộp sổ từ Chi đoàn
        </h2>
        <div className="so-doan-actions">
          <button
            className="btn-primary btn-primary--success"
            title="Duyệt tất cả"
          >
            <Check size={18} />
            Duyệt tất cả
          </button>
        </div>
      </div>

      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm theo Tên hoặc MSSV..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={[
          { value: "all", label: "Tất cả" },
          { value: "Chờ duyệt", label: "Chờ duyệt" },
        ]}
      />

      <div className="so-doan-card">
        <table className="so-doan-table">
          <thead>
            <tr>
              <th>Mã số (Tạm)</th>
              <th>Đoàn viên</th>
              <th>Chi đoàn / Khoa</th>
              <th>Ngày yêu cầu</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((item) => (
              <tr key={item.id}>
                <td className="member-id-highlight">{item.id}</td>
                <td>
                  <div className="member-info">
                    <span className="member-name">{item.hoTen}</span>
                    <span className="member-id">MSSV: {item.idDV}</span>
                  </div>
                </td>
                <td>
                  <div className="member-info">
                    <span className="member-name">{item.khoa}</span>
                    <span className="member-id">{item.chiDoan}</span>
                  </div>
                </td>
                <td>{item.ngayYeuCau}</td>
                <td>
                  <span className="status-badge status-badge--warning">
                    {item.trangThai}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button
                      className="btn-icon btn-icon--info"
                      title="Xem thông tin"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="btn-icon btn-icon--success"
                      title="Duyệt tiếp nhận"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      className="btn-icon btn-icon--danger"
                      title="Từ chối"
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
    </div>
  );
};

export default SoDoanDuyet;
