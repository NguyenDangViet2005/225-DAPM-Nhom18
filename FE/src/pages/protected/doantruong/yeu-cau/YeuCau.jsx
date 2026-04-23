import { useState, useMemo, useEffect } from "react";
import { FileText } from "lucide-react";
import hoatdongAPI from "@/apis/hoatdong.api";
import DataTableToolbar from "@/components/commons/DataTableToolbar/DataTableToolbar";
import ActivityRequestDetailModal from "@/pages/protected/doantruong/hoat-dong/YeuCauHoatDongDetailModal";
import YeuCauStatsSection from "@/pages/protected/doantruong/yeu-cau/YeuCauStatsSection";
import YeuCauTable from "@/pages/protected/doantruong/yeu-cau/YeuCauTable";
import YeuCauHistoryModal from "@/pages/protected/doantruong/yeu-cau/YeuCauHistoryModal";
import "./YeuCau.css";

const YeuCau = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [showDetail, setShowDetail] = useState(false);
  const [selectedYC, setSelectedYC] = useState(null);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // History Modal State
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const result = await hoatdongAPI.getYeuCauActivities({
        page: 1,
        limit: 1000,
        status: "all",
      });
      if (result.success) {
        setRequests(result.data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách yêu cầu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    if (!requests) return [];
    return requests.filter((yc) => {
      // Main table ONLY shows pending requests
      if (yc.trangThaiHD !== "Chưa duyệt") return false;

      const searchStr = (searchTerm || "").toLowerCase();
      const matchTen = (yc.tenHD || "").toLowerCase().includes(searchStr);
      const matchDonVi = (yc.donViToChuc || "")
        .toLowerCase()
        .includes(searchStr);
      const matchesSearch = matchTen || matchDonVi;

      return matchesSearch;
    });
  }, [searchTerm, requests]);

  // Lấy ra danh sách lịch sử (Đã duyệt / Từ chối) để hiển thị trong Modal
  const historyRequests = useMemo(() => {
    if (!requests) return [];
    return requests.filter(
      (yc) => yc.trangThaiHD === "Đã duyệt" || yc.trangThaiHD === "Từ chối",
    );
  }, [requests]);

  const handleOpenDetail = (yc) => {
    setSelectedYC(yc);
    setShowDetail(true);
  };

  const handleApprove = async (yc) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn phê duyệt hoạt động "${yc.tenHD}" không?`,
      )
    ) {
      try {
        const res = await hoatdongAPI.approveYeuCau(yc.idHD);
        if (res.success) {
          alert(`Đã chấp thuận hoạt động "${yc.tenHD}"`);
          fetchRequests();
        }
      } catch (e) {
        alert(
          "Lỗi khi phê duyệt: " + (e?.response?.data?.message || e.message),
        );
      }
    }
  };

  const handleReject = async (yc) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn TỪ CHỐI hoạt động "${yc.tenHD}" không?`,
      )
    ) {
      try {
        const res = await hoatdongAPI.rejectYeuCau(yc.idHD);
        if (res.success) {
          alert(`Đã từ chối "${yc.tenHD}"`);
          fetchRequests();
        }
      } catch (e) {
        alert("Lỗi khi từ chối: " + (e?.response?.data?.message || e.message));
      }
    }
  };

  return (
    <div className="yc-container">
      <div className="yc-header">
        <h1 className="yc-title">Phê duyệt Yêu cầu mở Hoạt động</h1>
        <div className="yc-actions">
          <button
            className="yc-update-btn"
            onClick={() => setShowHistoryModal(true)}
          >
            <FileText size={18} /> Lịch sử phê duyệt
          </button>
        </div>
      </div>

      <YeuCauStatsSection requests={requests} />

      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm theo tên hoạt động, đơn vị yêu cầu..."
      />

      <YeuCauTable
        requests={filteredRequests}
        loading={loading}
        onOpenDetail={handleOpenDetail}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <YeuCauHistoryModal
        show={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        historyRequests={historyRequests}
      />

      <ActivityRequestDetailModal
        show={showDetail}
        onClose={() => setShowDetail(false)}
        request={selectedYC}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default YeuCau;
