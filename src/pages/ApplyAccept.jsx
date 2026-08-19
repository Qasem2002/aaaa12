import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Info, ArrowLeft, Package } from "lucide-react";
import DemoBanner from "@/components/bank/DemoBanner";
import PortalLogo from "@/components/bank/PortalLogo";
import { serviceLabel, serviceFields, formatDate, PRIVACY_NOTE } from "@/lib/bankData";

const GREEN = "#1c693a";

export default function ApplyAccept() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("last_request");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch {}
    }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <DemoBanner />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-4">
            <p className="text-slate-500">لا توجد بيانات طلب حديثة.</p>
            <Link to="/" className="font-semibold hover:underline" style={{ color: GREEN }}>
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const rows = [
    ["الاسم الكامل", data.form.applicant_name],
    ["الرقم القومي", data.form.national_id],
    ["رقم الهاتف", data.form.phone],
    ["المحافظة", data.form.governorate],
    ["عنوان التوصيل", data.form.address],
    ["نوع الخدمة", serviceLabel(data.form.service_type)],
    ...serviceFields(data.form.service_type).map((f) => [f.label, data.form.details?.[f.name] || "—"]),
    ["تاريخ التقديم", formatDate(data.submittedAt)],
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoBanner />
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex justify-center">
        <PortalLogo />
      </header>

      <div className="flex-1 flex justify-center px-4 py-8">
        <div className="w-full max-w-lg space-y-6">
          {/* Request details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Package className="w-4 h-4" style={{ color: GREEN }} />
              <h2 className="font-bold text-slate-800">بيانات الطلب</h2>
            </div>
            <div className="rounded-xl border border-slate-200 divide-y divide-slate-100">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 p-3 text-sm">
                  <span className="text-slate-500">{k}</span>
                  <span className="text-slate-900 font-medium text-left">{v || "—"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              to={`/track/${data.requestId}`}
              className="w-full h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2"
              style={{ backgroundColor: GREEN }}
            >
              تتبع حالة الطلب
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link
              to="/"
              className="w-full h-12 rounded-xl font-bold border border-slate-200 text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50"
            >
              العودة للرئيسية
            </Link>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{PRIVACY_NOTE}</span>
          </div>
        </div>
      </div>
    </div>
  );
}