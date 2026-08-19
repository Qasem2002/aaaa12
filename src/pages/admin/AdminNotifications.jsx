import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { formatDate } from "@/lib/bankData";

export default function AdminNotifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.DemoNotification.list("-created_date", 200).then((n) => {
      setItems(n);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">الإشعارات</h1>
        <p className="text-sm text-slate-500 mt-1">إشعارات تجريبية تُنشأ عند تغيير حالة الطلبات.</p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">جاري التحميل...</div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center text-slate-400 rounded-2xl border border-slate-200 bg-white">لا توجد إشعارات.</div>
      ) : (
        <ul className="space-y-3">
          {items.map((n) => (
            <li key={n.id} className="rounded-2xl border border-slate-200 bg-white p-4 flex items-start gap-3">
              <span className="w-9 h-9 rounded-xl bg-[#0E7A5F]/10 text-[#0E7A5F] flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </span>
              <div>
                <p className="text-slate-800 text-sm">{n.message}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {n.request_number ? `${n.request_number} · ` : ""}{formatDate(n.created_date)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}