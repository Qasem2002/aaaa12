import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { base44 } from "@/api/base44Client";
import { SERVICE_TYPES, STATUSES } from "@/lib/bankData";

export default function AdminReports() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.ServiceRequest.list("-created_date", 500).then((r) => {
      setRequests(r);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="py-20 text-center text-slate-400">جاري التحميل...</div>;

  const byService = SERVICE_TYPES.map((s) => ({
    name: s.label,
    عدد: requests.filter((r) => r.service_type === s.value).length,
  }));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">التقارير</h1>
        <p className="text-sm text-slate-500 mt-1">تقارير تجريبية مبنية على بيانات المحاكاة</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-800 mb-4">الطلبات حسب نوع الخدمة</h2>
        <div className="h-72" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byService}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="عدد" fill="#0E7A5F" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-800 mb-4">ملخص الحالات</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(STATUSES).map(([k, v]) => (
            <div key={k} className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm text-slate-500">{v.label}</div>
              <div className="text-xl font-bold mt-1">{requests.filter((r) => r.status === k).length}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}