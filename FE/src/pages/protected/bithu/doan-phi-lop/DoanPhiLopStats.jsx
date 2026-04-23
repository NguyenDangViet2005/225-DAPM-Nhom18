import { Wallet, CheckCircle, AlertTriangle } from "lucide-react";
import { formatMoney, formatNumber } from "@/utils";
import { CircleProgress } from "./CircleProgress";

const DoanPhiLopStats = ({ stats }) => {
  return (
    <div className="dpl-stats">
      <div className="dpl-stat-card">
        <div className="dpl-stat-card__icon dpl-stat-card__icon--blue">
          <Wallet size={20} />
        </div>
        <div>
          <p className="dpl-stat-card__label">Mức phí {stats.namHoc}</p>
          <p className="dpl-stat-card__value">{formatMoney(stats.soTien)}</p>
        </div>
      </div>

      <div className="dpl-stat-card">
        <div className="dpl-stat-card__icon dpl-stat-card__icon--green">
          <CheckCircle size={20} />
        </div>
        <div>
          <p className="dpl-stat-card__label">Đã đóng</p>
          <p className="dpl-stat-card__value">
            {formatNumber(stats.daDong)}
            <span className="dpl-stat-card__total">/{formatNumber(stats.tongDoanVien)}</span>
          </p>
        </div>
      </div>

      <div className="dpl-stat-card">
        <div className="dpl-stat-card__icon dpl-stat-card__icon--amber">
          <AlertTriangle size={20} />
        </div>
        <div>
          <p className="dpl-stat-card__label">Chưa đóng / Chờ duyệt</p>
          <p className="dpl-stat-card__value">
            {formatNumber(stats.chuaDong)} / {formatNumber(stats.dangChoDuyet)}{" "}
            <span className="dpl-stat-card__unit">đoàn viên</span>
          </p>
        </div>
      </div>

      <div className="dpl-stat-card dpl-stat-card--progress">
        <div className="dpl-stat-card__icon dpl-stat-card__icon--blue">
          <Wallet size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <p className="dpl-stat-card__label">Tổng đã thu (được duyệt)</p>
          <p className="dpl-stat-card__value">{formatMoney(stats.tongDaThu)}</p>
        </div>
        <CircleProgress pct={stats.tyLe || 0} />
      </div>
    </div>
  );
};

export default DoanPhiLopStats;
