import { useState, useEffect, useMemo } from 'react';
import { doanviendangkiAPI } from '@/apis/doanviendangki.api';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import './LichSuDK.css';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

const filterOptions = [
  { value: 'all',       label: 'Tất cả trạng thái' },
  { value: 'Đã duyệt',  label: 'Đã duyệt' },
  { value: 'Chờ duyệt', label: 'Chờ duyệt' },
  { value: 'Từ chối',   label: 'Từ chối' },
];

const LichSuDK = () => {
  const [data, setData]             = useState([]);
  const [loading, setLoading]       = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter]         = useState('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await doanviendangkiAPI.getLichSuDangKy();
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = useMemo(() => {
    return data.filter(dk => {
      const matchSearch =
        dk.tenHD.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dk.donViToChuc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchFilter = filter === 'all' || dk.trangThaiDuyet === filter;
      return matchSearch && matchFilter;
    });
  }, [data, searchTerm, filter]);

  return (
    <div className="lsdk-container">
      <h1 className="lsdk-title">Lịch sử đăng ký hoạt động</h1>

      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm kiếm tên hoạt động, đơn vị..."
        filterValue={filter}
        onFilterChange={setFilter}
        filterOptions={filterOptions}
      />

      <div className="lsdk-card">
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Đang tải...</div>
        )}
        <table className="lsdk-table">
          <thead>
            <tr>
              <th>Tên hoạt động</th>
              <th>Đơn vị tổ chức</th>
              <th>Ngày tổ chức</th>
              <th>Ngày đăng ký</th>
              <th>Trạng thái duyệt</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((dk, i) => (
              <tr key={`${dk.idHD}-${i}`}>
                <td style={{ fontWeight: 600 }}>{dk.tenHD}</td>
                <td style={{ color: '#64748b' }}>{dk.donViToChuc}</td>
                <td>{fmtDate(dk.ngayToChuc)}</td>
                <td>{fmtDate(dk.ngayDangKi)}</td>
                <td>
                  <span className={`lsdk-badge ${
                    dk.trangThaiDuyet === 'Đã duyệt'  ? 'lsdk-badge--green' :
                    dk.trangThaiDuyet === 'Chờ duyệt' ? 'lsdk-badge--yellow' :
                    'lsdk-badge--red'
                  }`}>
                    {dk.trangThaiDuyet}
                  </span>
                </td>
                <td>
                  {dk.lyDoTuChoi ? (
                    <span title={dk.lyDoTuChoi} style={{ color: '#b91c1c', fontSize: '0.8rem', cursor: 'help' }}>
                      Từ chối ⓘ
                    </span>
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>—</span>
                  )}
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="lsdk-empty">Không có dữ liệu phù hợp</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LichSuDK;
