import { Trash2, Clock, CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "@/utils";
import { YEU_CAU_STATUS } from "@/constants";

const STATUS_CFG = {
  [YEU_CAU_STATUS.CHO_DUYET]: { cls: "gyc-badge--pending", icon: <Clock size={11} /> },
  [YEU_CAU_STATUS.DA_DUYET]: { cls: "gyc-badge--approved", icon: <CheckCircle size={11} /> },
  [YEU_CAU_STATUS.TU_CHOI]: { cls: "gyc-badge--rejected", icon: <XCircle size={11} /> },
};

const YeuCauTable = ({ list, setList }) => {
  return (
    <div className="gyc-card">
      <div className="gyc-table-wrap">
        <table className="gyc-table">
          <thead>
            <tr>
              <th>Tên hoạt động</th>
              <th>Ngày dự kiến</th>
              <th>Địa điểm</th>
              <th>Số lượng</th>
              <th>Ngày gửi</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {list.map((yc, idx) => {
              const cfg = STATUS_CFG[yc.trangThaiYC] || {};
              return (
                <tr key={yc.idYC} className={idx % 2 === 1 ? "gyc-tr--alt" : ""}>
                  <td className="gyc-td-name">{yc.tenHD}</td>
                  <td className="gyc-td-muted">{formatDate(yc.ngayDuKien)}</td>
                  <td>{yc.diaDiemDuKien}</td>
                  <td className="gyc-td-muted">{yc.soLuongDuKien} người</td>
                  <td className="gyc-td-muted">{formatDate(yc.ngayGui)}</td>
                  <td>
                    <span className={`gyc-badge ${cfg.cls}`}>
                      {cfg.icon} {yc.trangThaiYC}
                    </span>
                  </td>
                  <td>
                    {yc.trangThaiYC === YEU_CAU_STATUS.CHO_DUYET ? (
                      <button
                        className="gyc-btn gyc-btn--danger gyc-btn--sm"
                        onClick={() => setList((p) => p.filter((y) => y.idYC !== yc.idYC))}
                      >
                        <Trash2 size={13} /> Hủy
                      </button>
                    ) : (
                      <span className="gyc-td-muted">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr>
                <td colSpan="7" className="gyc-empty">
                  Chưa có yêu cầu nào được gửi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default YeuCauTable;
