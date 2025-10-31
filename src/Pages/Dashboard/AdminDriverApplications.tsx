import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { listDriverApplications } from "../../Config/adminDriverApplications";


type Status = "draft" | "pending" | "approved" | "rejected";

interface ApplicationItem {
  _id: string;
  status: Status;
  createdAt: string;
  personal?: {
    fullName?: string;
    email?: string;
    phone?: string;
    idNumber?: string;
  };
  yearsExperience?: number;
  services?: string[];
}


const AdminDriverApplications = () => {
  const [sp, setSp] = useSearchParams();
  const [status, setStatus] = useState<Status | "">((sp.get("status") as Status) || "pending");
  const [search, setSearch] = useState(sp.get("search") || "");
  const [searchInput, setSearchInput] = useState(search);
  const [page, setPage] = useState(Number(sp.get("page") || 1));
  const [limit, setLimit] = useState(Number(sp.get("limit") || 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ApplicationItem[]>([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  // const [refreshKey, setRefreshKey] = useState(0);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  useEffect(() => {
    const next = new URLSearchParams(sp);
    if (status) next.set("status", status); else next.delete("status");
    if (search) next.set("search", search); else next.delete("search");
    next.set("page", String(page));
    next.set("limit", String(limit));
    setSp(next, { replace: true });
  }, [status, search, page, limit, sp, setSp]);

  // debounce search input -> search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const { data } = await listDriverApplications({
          status: status || undefined,
          search: search || undefined,
          page,
          limit,
        });
        if (!ignore) {
          setItems(data?.items || []);
          setTotal(data?.total || 0);
        }
      } catch (e: unknown) {
        if (!ignore) {
          let message = "Lỗi tải dữ liệu";
          if (typeof e === "object" && e)
          {
            const err = e as { response?: { data?: { message?: string } }; message?: string };
            message = err.response?.data?.message || err.message || message;
          }
          setError(message);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchData();
    return () => {
      ignore = true;
    };
  }, [status, search, page, limit]);

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Quản lý hồ sơ tài xế</h1>
          <p className="text-sm text-gray-600">Danh sách, lọc, xem chi tiết, duyệt/từ chối</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-3 md:p-4 flex flex-wrap gap-3 items-end">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Trạng thái</label>
          <select
            className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value as Status | "");
            }}
          >
            <option value="">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
            <option value="draft">Nháp</option>
          </select>
        </div>
        <div className="flex flex-col min-w-[220px]">
          <label className="text-sm text-gray-600">Tìm kiếm</label>
          <input
            className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tên/Email/SĐT"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="flex-1" />
        <div className="text-sm text-gray-600">Tổng: {total}</div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
        <table className="min-w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="text-left p-3 border-b">Họ tên</th>
              <th className="text-left p-3 border-b">Email</th>
              <th className="text-left p-3 border-b">SĐT</th>
              <th className="text-left p-3 border-b">Trạng thái</th>
              <th className="text-left p-3 border-b">Kinh nghiệm</th>
              <th className="text-left p-3 border-b">Dịch vụ</th>
              <th className="text-left p-3 border-b">Ngày tạo</th>
              <th className="text-left p-3 border-b w-40">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-6 text-center" colSpan={8}>Đang tải...</td>
              </tr>
            ) : error ? (
              <tr>
                <td className="p-6 text-red-600" colSpan={8}>{error}</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td className="p-6 text-center" colSpan={8}>Không có dữ liệu</td>
              </tr>
            ) : (
              items.map((it, idx) => (
                <tr key={it._id} className={idx % 2 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 border-b">{it.personal?.fullName || "-"}</td>
                  <td className="p-3 border-b">{it.personal?.email || "-"}</td>
                  <td className="p-3 border-b">{it.personal?.phone || "-"}</td>
                  <td className="p-3 border-b">{renderStatusBadge(it.status)}</td>
                  <td className="p-3 border-b">{typeof it.yearsExperience === "number" ? it.yearsExperience : "-"}</td>
                  <td className="p-3 border-b">{Array.isArray(it.services) && it.services.length ? it.services.map(mapService).join(", ") : "-"}</td>
                  <td className="p-3 border-b">{formatDateTime(it.createdAt)}</td>
                  <td className="p-3 border-b">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={() => navigate(`/dashboard/driver-application/${it._id}`)}>Xem</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 justify-end">
        <button
          className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          disabled={page <= 1 || loading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Trước
        </button>
        <div className="text-sm">Trang {page}/{totalPages}</div>
        <button
          className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          disabled={page >= totalPages || loading}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Sau
        </button>
        <div className="flex items-center gap-1 ml-4 text-sm">
          <span>Hiển thị</span>
          <select className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500" value={limit} onChange={(e) => { setPage(1); setLimit(Number(e.target.value)); }}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>mục</span>
        </div>
      </div>
      {/* Detail now navigates to dedicated page */}
    </div>
  );
};

export default AdminDriverApplications;

function renderStatusBadge(status: Status) {
  const map: Record<Status, { text: string; cls: string }> = {
    draft: { text: "Nháp", cls: "bg-gray-100 text-gray-700" },
    pending: { text: "Chờ duyệt", cls: "bg-amber-100 text-amber-800" },
    approved: { text: "Đã duyệt", cls: "bg-green-100 text-green-800" },
    rejected: { text: "Từ chối", cls: "bg-red-100 text-red-700" },
  };
  const m = map[status];
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${m.cls}`}>{m.text}</span>;
}

function formatDateTime(value: string) {
  const d = new Date(value);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

function mapService(code: string) {
  const map: Record<string, string> = {
    dich_vu_tai_xe_theo_gio: "Dịch vụ tài xế theo giờ",
    dich_vu_tai_xe_theo_cay_so: "Dịch vụ tài xế theo cây số",
    dich_vu_tai_xe_theo_ngay: "Dịch vụ tài xế theo ngày",
    dich_vu_tai_xe_lien_tinh: "Dịch vụ tài xế liên tỉnh",
  };
  return map[code] || code;
}


