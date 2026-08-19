import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, History } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import StatusChip from "@/components/bank/StatusChip";
import StatusTimeline from "@/components/bank/StatusTimeline";
import { STATUSES, formatDate, serviceFields } from "@/lib/bankData";

const ACTIONS = [
  { status: "reviewing", label: "بدء المراجعة" },
  { status: "approved", label: "الموافقة على الطلب" },
  { status: "rejected", label: "رفض الطلب" },
  { status: "info_requested", label: "طلب معلومات إضافية" },
  { status: "completed", label: "تحديد كمكتمل" },
];

export default function AdminRequestDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [r, setR] = useState(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const data = await base44.entities.ServiceRequest.get(id);
    setR(data);
    setNotes(data?.admin_notes || "");
  };

  useEffect(() => {
    load();
  }, [id]);

  const changeStatus = async (status, label) => {
    setSaving(true);
    const now = new Date().toISOString();
    await base44.entities.ServiceRequest.update(id, {
      status,
      admin_notes: notes,
      last_update: now,
      audit_log: [...(r.audit_log || []), { action: `${label} — الحالة: ${STATUSES[status].label}`, at: now, by: "الإدارة" }],
    });
    const message =
      status === "info_requested"
        ? "يرجى مراجعة الملاحظات وإكمال البيانات المطلوبة."
        : `تم تحديث حالة طلبك رقم #${r.request_number} إلى: ${STATUSES[status].label}.`;
    await base44.entities.DemoNotification.create({ request_number: r.request_number, message, status });
    await load();
    setSaving(false);
    toast({ title: "تم تحديث حالة الطلب", description: STATUSES[status].label });
  };

  if (!r) return <div className="py-20 text-center text-slate-400">جاري التحميل...</div>;

  const info = [
    ["الاسم الكامل", r.applicant_name],
    ["الرقم الوطني التجريبي", r.national_id],
    ["رقم الهاتف التجريبي", r.phone],
    ["المحافظة", r.governorate],
    ["العنوان", r.address],
  ];
  const details = serviceFields(r.service_type).map((f) => [f.label, r.details?.[f.name] || "—"]);

  return (
    <div className="space-y-5">
      <Link to="/admin/requests" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#0E7A5F]">
        <ArrowRight className="w-4 h-4" />
        رجوع للطلبات
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{r.request_number}</h1>
          <p className="text-sm text-slate-500 mt-1">{r.service_label} · {formatDate(r.submitted_at)}</p>
        </div>
        <StatusChip status={r.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-800 mb-3">معلومات مقدم الطلب</h2>
            <div className="divide-y divide-slate-100 text-sm">
              {info.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-medium text-left">{v || "—"}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-800 mb-3">تفاصيل الخدمة</h2>
            {details.length === 0 ? (
              <p className="text-sm text-slate-400">لا توجد تفاصيل.</p>
            ) : (
              <div className="divide-y divide-slate-100 text-sm">
                {details.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-2.5">
                    <span className="text-slate-500">{k}</span>
                    <span className="font-medium text-left">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
            <h2 className="font-semibold text-slate-800">الملاحظات</h2>
            <Textarea
              className="rounded-xl border-slate-200 min-h-24"
              placeholder="اكتب ملاحظات تظهر لمقدم الطلب..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                await base44.entities.ServiceRequest.update(id, { admin_notes: notes });
                await load();
                setSaving(false);
                toast({ title: "تم حفظ الملاحظات" });
              }}
            >
              حفظ الملاحظات
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-[#0E7A5F]" />
              سجل التغييرات
            </h2>
            <ul className="space-y-2 text-sm">
              {(r.audit_log || []).map((a, i) => (
                <li key={i} className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <p className="text-slate-800">{a.action}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{formatDate(a.at)} · {a.by}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
            <h2 className="font-semibold text-slate-800">الإجراءات</h2>
            {ACTIONS.map((a) => (
              <Button
                key={a.status}
                disabled={saving || r.status === a.status}
                onClick={() => changeStatus(a.status, a.label)}
                className={`w-full rounded-xl justify-start ${
                  a.status === "rejected"
                    ? "bg-red-600 hover:bg-red-700"
                    : a.status === "approved"
                    ? "bg-[#0E7A5F] hover:bg-[#0b6450]"
                    : "bg-slate-800 hover:bg-slate-900"
                }`}
              >
                {a.label}
              </Button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-800 mb-3">حالة الطلب</h2>
            <StatusTimeline status={r.status} />
          </div>
        </div>
      </div>
    </div>
  );
}