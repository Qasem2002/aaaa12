import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { formatDate } from "@/lib/bankData";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.DemoUser.list("-created_date", 200).then((u) => {
      setUsers(u);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">المستخدمون التجريبيون</h1>
        <p className="text-sm text-slate-500 mt-1">بيانات وهمية بالكامل — لا تحتوي أي معلومات مصرفية.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">جاري التحميل...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-400">لا يوجد مستخدمون.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {["الاسم", "اسم المستخدم", "رقم الهاتف الوهمي", "تاريخ التسجيل", "عدد الطلبات", "حالة الحساب"].map((h) => (
                    <th key={h} className="text-right font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{u.name}</td>
                    <td className="px-4 py-3 text-slate-500">{u.username}</td>
                    <td className="px-4 py-3 text-slate-500">{u.phone}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(u.joined_date)}</td>
                    <td className="px-4 py-3">{u.requests_count || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${u.active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        {u.active ? "نشط" : "موقوف"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}