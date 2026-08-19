import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { RefreshCw, Bell } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import BankLogo from "@/components/bank/BankLogo";
import DemoBanner from "@/components/bank/DemoBanner";
import StatusTimeline from "@/components/bank/StatusTimeline";
import StatusChip from "@/components/bank/StatusChip";
import { formatDate, STATUSES } from "@/lib/bankData";

export default function TrackRequest() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const r = await base44.entities.ServiceRequest.get(id);
    setRequest(r);
    if (r) {
      const n = await base44.entities.DemoNotification.filter({ request_number: r.request_number }, "-created_date");
      setNotes(n);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-9 h-9 border-4 border-slate-200 border-t-[#0E7A5F] rounded-full animate-spin" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 text-center px-4">
        <p className="text-slate-600">لم يتم العثور على الطلب.</p>
        <Link to="/apply">
          <Button className="bg-[#0E7A5F] hover:bg-[#0b6450] rounded-xl">تقديم طلب جديد</Button>
        </Link>
      </div>
    );
  }

  const inProgress = !["approved", "completed", "rejected"].includes(request.status);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoBanner />
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex justify-center">
        <BankLogo />
      </header>

      <div className="flex-1 flex justify-center px-4 py-8">
        <div className="w-full max-w-lg space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-3">
              {inProgress && (
                <div className="mx-auto w-12 h-12 border-4 border-slate-200 border-t-[#0E7A5F] rounded-full animate-spin" />
              )}
              <h1 className="text-xl font-bold text-slate-900">
                {inProgress ? "جاري معالجة طلبك..." : STATUSES[request.status].label}
              </h1>
              <p className="text-sm text-slate-500">
                يرجى الانتظار، يقوم فريقنا بمراجعة بيانات الطلب والتحقق منها.
              </p>
            </div>

            <StatusTimeline status={request.status} />

            <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 text-sm">
              <div className="flex justify-between p-3">
                <span className="text-slate-500">رقم الطلب</span>
                <span className="font-semibold">{request.request_number}</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-slate-500">نوع الخدمة</span>
                <span className="font-medium">{request.service_label}</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-slate-500">تاريخ الطلب</span>
                <span className="font-medium">{formatDate(request.submitted_at)}</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-slate-500">آخر تحديث</span>
                <span className="font-medium">{formatDate(request.last_update)}</span>
              </div>
              <div className="flex justify-between items-center p-3">
                <span className="text-slate-500">الحالة الحالية</span>
                <StatusChip status={request.status} />
              </div>
              <div className="p-3 space-y-1">
                <span className="text-slate-500">ملاحظات الإدارة</span>
                <p className="text-slate-800">{request.admin_notes || "لا توجد ملاحظات حتى الآن."}</p>
              </div>
            </div>

            <Button onClick={load} variant="outline" className="w-full rounded-xl gap-2 py-6">
              <RefreshCw className="w-4 h-4" />
              تحديث البيانات
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <Bell className="w-4 h-4 text-[#0E7A5F]" />
              الإشعارات
            </div>
            {notes.length === 0 ? (
              <p className="text-sm text-slate-400">لا توجد إشعارات.</p>
            ) : (
              <ul className="space-y-2">
                {notes.map((n) => (
                  <li key={n.id} className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-sm">
                    <p className="text-slate-800">{n.message}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{formatDate(n.created_date)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="text-center">
            <Link to="/" className="text-sm text-slate-500 hover:text-[#0E7A5F] hover:underline">
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}