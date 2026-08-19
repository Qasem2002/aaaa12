import React, { useEffect, useState } from "react";
import { FileText, Sparkles, Clock, CheckCircle2, XCircle, Archive } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { base44 } from "@/api/base44Client";
import StatCard from "@/components/admin/StatCard";
import { STATUSES } from "@/lib/bankData";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.ServiceRequest.list("-created_date", 500).then((r) => {
      setRequests(r);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-slate-400">جاري تحميل البيانات...</div>;
  }

  const count = (s) => requests.filter((r) => r.status === s).length;

  const byStatus = Object.keys(STATUSES).map((k) => ({
    name: STATUSES[k].label,
    عدد: count(k),
  }));

  const byDay = (() => {
    const map = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      map[d.toLocaleDateString("ar", { month: "short", day: "numeric" })] = 0;
    }
    requests.forEach((r) => {
      const key = new Date(r.submitted_at || r.created_date).toLocaleDateString("ar", {
        month: "short",
        day: "numeric",
      });
      if (key in map) map[key] += 1;
    });
    return Object.entries(map).map(([name, عدد]) => ({ name, عدد }));
  })();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">لوحة التحكم</h1>
        <p className="text-sm text-slate-500 mt-1">نظرة عامة على الطلبات التجريبية</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard label="إجمالي الطلبات" value={requests.length} icon={FileText} />
        <StatCard label="الطلبات الجديدة" value={count("new")} icon={Sparkles} tone="text-amber-600 bg-amber-50" />
        <StatCard label="قيد المراجعة" value={count("reviewing")} icon={Clock} tone="text-blue-600 bg-blue-50" />
        <StatCard label="تمت الموافقة" value={count("approved")} icon={CheckCircle2} tone="text-emerald-600 bg-emerald-50" />
        <StatCard label="مرفوضة" value={count("rejected")} icon={XCircle} tone="text-red-600 bg-red-50" />
        <StatCard label="مكتملة" value={count("completed")} icon={Archive} tone="text-slate-700 bg-slate-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-800 mb-4">الطلبات حسب الحالة</h2>
          <div className="h-64" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="عدد" fill="#0E7A5F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-800 mb-4">الطلبات خلال 7 أيام</h2>
          <div className="h-64" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="عدد" stroke="#0E7A5F" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}