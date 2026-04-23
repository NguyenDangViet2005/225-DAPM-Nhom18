import { useMemo, useState, useEffect } from "react";
import { Activity, ClipboardList, GraduationCap, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { formatNumber } from "@/utils";
import { COLORS } from "@/constants";
import doanviendangkiAPI from "@/apis/doanviendangki.api";
import DashboardHeader from "@/pages/protected/doantruong/dashboard/DashboardHeader";
import DashboardStatsSection from "@/pages/protected/doantruong/dashboard/DashboardStatsSection";
import DashboardMembersTable from "@/pages/protected/doantruong/dashboard/DashboardMembersTable";
import DashboardNotifications from "@/pages/protected/doantruong/dashboard/DashboardNotifications";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState({
    stats: {
      tongDoanVien: 0,
      tongKhoa: 0,
      tongHoatDongCapTruongConHieuLuc: 0,
      tongHoSoChoDuyet: 0,
    },
    recentMembers: [],
  });

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await doanviendangkiAPI.getDoanTruongDashboard();
        if (!isMounted) return;

        setDashboardData({
          stats: response?.data?.stats || {
            tongDoanVien: 0,
            tongKhoa: 0,
            tongHoatDongCapTruongConHieuLuc: 0,
            tongHoSoChoDuyet: 0,
          },
          recentMembers: response?.data?.recentMembers || [],
        });
      } catch (err) {
        if (!isMounted) return;
        setError(
          err?.response?.data?.message || "Không thể tải dữ liệu dashboard",
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      {
        title: "Tổng Đoàn Viên",
        value: formatNumber(dashboardData.stats.tongDoanVien),
        icon: Users,
        color: COLORS.PRIMARY,
        trend: "Toàn trường",
      },
      {
        title: "Số lượng Khoa",
        value: formatNumber(dashboardData.stats.tongKhoa),
        icon: GraduationCap,
        color: COLORS.SUCCESS,
        trend: "Đang hoạt động",
      },
      {
        title: "Hoạt Động Cấp Trường",
        value: formatNumber(
          dashboardData.stats.tongHoatDongCapTruongConHieuLuc,
        ),
        icon: Activity,
        color: COLORS.INFO,
        trend: "Còn hiệu lực",
      },
      {
        title: "Hồ Sơ Chờ Duyệt",
        value: formatNumber(dashboardData.stats.tongHoSoChoDuyet),
        icon: ClipboardList,
        color: COLORS.DANGER,
        trend: "Đăng ký hoạt động",
      },
    ],
    [dashboardData.stats],
  );

  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return dashboardData.recentMembers;

    const keyword = searchTerm.toLowerCase().trim();
    return dashboardData.recentMembers.filter(
      (row) =>
        row.hoTen?.toLowerCase().includes(keyword) ||
        row.maSV?.toLowerCase().includes(keyword) ||
        row.tenKhoa?.toLowerCase().includes(keyword) ||
        row.tenHD?.toLowerCase().includes(keyword),
    );
  }, [dashboardData.recentMembers, searchTerm]);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-main">
        <DashboardHeader
          user={user}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <DashboardStatsSection stats={stats} />

        <section className="dashboard-content-grid">
          <DashboardMembersTable
            members={filteredMembers}
            loading={loading}
            error={error}
          />

          <DashboardNotifications />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
