import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { approveDriverApplication, getDriverApplicationById, rejectDriverApplication } from "../../Config/adminDriverApplications";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../../Model/User";

type Status = "draft" | "pending" | "approved" | "rejected";

interface ApplicationDetail {
  _id: string;
  status: Status;
  createdAt: string;
  updatedAt?: string;
  submittedAt?: string | null;
  decidedAt?: string | null;
  rejectionReason?: string | null;
  userId?: string;
  personal?: { fullName?: string; email?: string; phone?: string; idNumber?: string };
  address?: { province?: string; district?: string; ward?: string; specificAddress?: string };
  licenseNumber?: string;
  licenseExpiry?: string;
  yearsExperience?: number;
  services?: string[];
  documents?: Record<string, string>;
}

export default function AdminDriverApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApplicationDetail | null>(null);
  const [working, setWorking] = useState(false);
  const [reason, setReason] = useState("");
  const [openReject, setOpenReject] = useState(false);

  const role = useMemo(() => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return "";
      const decoded: JwtPayload = jwtDecode(token);
      return decoded.role;
    } catch {
      return "";
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getDriverApplicationById(id);
        if (!ignore) setData(res?.data as ApplicationDetail);
      } catch (e: unknown) {
        if (!ignore) {
          let message = "Lỗi tải chi tiết";
          if (typeof e === "object" && e) {
            const err = e as { response?: { data?: { message?: string } }; message?: string };
            message = err.response?.data?.message || err.message || message;
          }
          setError(message);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [id]);

  async function refresh() {
    if (!id) return;
    setLoading(true);
    try {
      const res = await getDriverApplicationById(id);
      setData(res?.data as ApplicationDetail);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200" onClick={() => navigate(-1)}>Quay lại</button>
          <h1 className="text-xl md:text-2xl font-semibold">Chi tiết hồ sơ</h1>
          {data && renderStatusBadge(data.status)}
        </div>
        {role === "admin" && data?.status === "pending" && (
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              disabled={working}
              onClick={async () => {
                if (!id) return;
                setWorking(true);
                try {
                  await approveDriverApplication(id);
                  await refresh();
                } finally {
                  setWorking(false);
                }
              }}
            >
              Duyệt
            </button>
            <button className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700" onClick={() => setOpenReject(true)}>Từ chối</button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-4 space-y-4">
        {loading ? (
          <div>Đang tải...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : !data ? (
          <div>Không có dữ liệu</div>
        ) : (
          <>
            <Section title="Thông tin hồ sơ">
              <Field label="Mã người dùng" value={data.userId} />
              <Field label="Ngày tạo" value={data.createdAt ? new Date(data.createdAt).toLocaleString() : ""} />
              <Field label="Gửi duyệt" value={data.submittedAt ? new Date(data.submittedAt).toLocaleString() : ""} />
              <Field label="Quyết định" value={data.decidedAt ? new Date(data.decidedAt).toLocaleString() : ""} />
              <Field label="Cập nhật" value={data.updatedAt ? new Date(data.updatedAt).toLocaleString() : ""} />
              {data.status === "rejected" && (
                <div className="col-span-2">
                  <div className="text-gray-500 text-sm">Lý do từ chối</div>
                  <div className="font-medium">{data.rejectionReason || "-"}</div>
                </div>
              )}
            </Section>
            <Section title="Thông tin cá nhân">
              <Field label="Họ tên" value={data.personal?.fullName} />
              <Field label="Email" value={data.personal?.email} />
              <Field label="SĐT" value={data.personal?.phone} />
              <Field label="CCCD/CMND" value={data.personal?.idNumber} />
            </Section>
            <Section title="Địa chỉ">
              <Field label="Tỉnh/Thành" value={data.address?.province} />
              <Field label="Quận/Huyện" value={data.address?.district} />
              <Field label="Phường/Xã" value={data.address?.ward} />
              <Field label="Địa chỉ cụ thể" value={data.address?.specificAddress} />
            </Section>
            <Section title="Bằng lái & Kinh nghiệm">
              <Field label="Số bằng lái" value={data.licenseNumber} />
              <Field label="Hết hạn" value={data.licenseExpiry ? new Date(data.licenseExpiry).toLocaleDateString() : ""} />
              <Field label="Kinh nghiệm (năm)" value={typeof data.yearsExperience === "number" ? String(data.yearsExperience) : ""} />
              <div className="text-sm">
                <div className="text-gray-500">Dịch vụ</div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {Array.isArray(data.services) && data.services.length > 0 ? (
                    data.services.map((s: string) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs">{s}</span>
                    ))
                  ) : (
                    <span className="text-gray-600">-</span>
                  )}
                </div>
              </div>
            </Section>
            <Section title="Giấy tờ">
              <DocsGrid urls={data.documents || {}} />
            </Section>
          </>
        )}
      </div>

      {openReject && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center" onClick={() => setOpenReject(false)}>
          <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h4 className="font-semibold mb-2">Nhập lý do từ chối</h4>
            <textarea className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-red-500" value={reason} onChange={(e) => setReason(e.target.value)} rows={4} maxLength={300} />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Yêu cầu bắt buộc</span>
              <span>{reason.length}/300</span>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="border px-3 py-1 rounded" onClick={() => setOpenReject(false)}>Hủy</button>
              <button
                className="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-50 hover:bg-red-700"
                disabled={working || !reason.trim() || !id}
                onClick={async () => {
                  if (!id) return;
                  setWorking(true);
                  try {
                    await rejectDriverApplication(id, reason.trim());
                    setOpenReject(false);
                    setReason("");
                    await refresh();
                  } finally {
                    setWorking(false);
                  }
                }}
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="grid grid-cols-2 gap-2">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="text-sm">
      <div className="text-gray-500">{label}</div>
      <div className="font-medium">{value || "-"}</div>
    </div>
  );
}

function DocsGrid({ urls }: { urls: Record<string, string | undefined> }) {
  const entries = Object.entries(urls).filter(([, v]) => Boolean(v));
  const [preview, setPreview] = useState<{ url: string; label: string } | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPreview(null);
    }
    if (preview) {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [preview]);

  return (
    <>
      {entries.length === 0 ? (
        <div className="text-sm">Không có tài liệu</div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {entries.map(([k, v]) => {
            const url = String(v);
            const isImage = /(jpg|jpeg|png|gif|webp)$/i.test(url);
            return (
              <div key={k} className="border rounded p-2 hover:bg-gray-50 flex items-center gap-2">
                {isImage ? (
                  <button
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setPreview({ url, label: k })}
                    title="Xem ảnh"
                  >
                    <img src={url} alt={k} className="w-16 h-16 object-cover rounded cursor-zoom-in" />
                  </button>
                ) : (
                  <a className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500" href={url} target="_blank" rel="noreferrer">
                    DOC
                  </a>
                )}
                <a className="text-blue-700 underline break-all" href={url} target="_blank" rel="noreferrer">{k}</a>
              </div>
            );
          })}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" onClick={() => setPreview(null)}>
          <div className="max-w-5xl max-h-[90vh] mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2 text-white">
              <div className="truncate pr-4">{preview.label}</div>
              <div className="flex gap-2">
                <a
                  href={preview.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm"
                >
                  Mở tab mới
                </a>
                <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm" onClick={() => setPreview(null)}>Đóng</button>
              </div>
            </div>
            <img src={preview.url} alt={preview.label} className="max-w-full max-h-[85vh] rounded shadow-lg" />
          </div>
        </div>
      )}
    </>
  );
}


