import React from "react";
import { ShieldAlert } from "lucide-react";
import { BANK_NAME, DISCLAIMER, DEMO_CREDS } from "@/lib/bankData";

export default function AdminSettings() {
  const rows = [
    ["اسم النظام", BANK_NAME],
    ["نوع النظام", "محاكاة تعليمية (Demo)"],
    ["اللغة والاتجاه", "العربية · RTL"],
    ["الحساب التجريبي", `${DEMO_CREDS.username} / ${DEMO_CREDS.password}`],
    ["تخزين البيانات", "قاعدة بيانات تجريبية داخل التطبيق"],
    ["الاتصال بأنظمة خارجية", "معطّل بالكامل"],
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">إعدادات النظام</h1>
        <p className="text-sm text-slate-500 mt-1">إعدادات عرضية لنظام المحاكاة</p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 flex items-start gap-3 text-amber-800">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="text-sm">{DISCLAIMER} لا يتم جمع أي بيانات بطاقات أو حسابات بنكية، ولا إرسال رسائل أو رموز تحقق حقيقية.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 divide-y divide-slate-100 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-3">
            <span className="text-slate-500">{k}</span>
            <span className="font-medium text-left">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}