import { CreditCard, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { formatMoney } from "@/utils";
import { COLORS } from "@/constants";

const DoanPhiStatsCards = ({ stats }) => {
  return (
    <div className="dp-stats">
      <div className="dp-stat-item">
        <span className="dp-stat-item__label">Tổng phải thu (Dự kiến)</span>
        <span className="dp-stat-item__value">
          {formatMoney(stats?.tongPhaiThu ?? 0)}
        </span>
        <CreditCard
          size={40}
          style={{
            position: "absolute",
            right: 20,
            bottom: 20,
            opacity: 0.05,
          }}
        />
      </div>
      <div
        className="dp-stat-item"
        style={{ borderLeft: `3px solid ${COLORS.SUCCESS}` }}
      >
        <span className="dp-stat-item__label">Đã thu thực tế</span>
        <span className="dp-stat-item__value">
          {formatMoney(stats?.tongDaThu ?? 0)}
        </span>
        <CheckCircle
          size={40}
          style={{
            position: "absolute",
            right: 20,
            bottom: 20,
            opacity: 0.1,
            color: COLORS.SUCCESS,
          }}
        />
      </div>
      <div
        className="dp-stat-item"
        style={{ borderLeft: `3px solid ${COLORS.WARNING}` }}
      >
        <span className="dp-stat-item__label">Phiếu thu chờ duyệt</span>
        <span className="dp-stat-item__value">
          {stats?.choDuyet ?? 0} Phiếu
        </span>
        <Clock
          size={40}
          style={{
            position: "absolute",
            right: 20,
            bottom: 20,
            opacity: 0.1,
            color: COLORS.WARNING,
          }}
        />
      </div>
      <div
        className="dp-stat-item"
        style={{ borderLeft: `3px solid ${COLORS.PRIMARY}` }}
      >
        <span className="dp-stat-item__label">Tỷ lệ hoàn thành</span>
        <span className="dp-stat-item__value">{stats?.tyLe ?? 0}%</span>
        <TrendingUp
          size={40}
          style={{
            position: "absolute",
            right: 20,
            bottom: 20,
            opacity: 0.1,
            color: COLORS.PRIMARY,
          }}
        />
      </div>
    </div>
  );
};

export default DoanPhiStatsCards;
