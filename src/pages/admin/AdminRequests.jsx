import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUpDown, Eye } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatusChip from "@/components/bank/StatusChip";
import { STATUSES, SERVICE_TYPES, formatDate } from "@/lib/bankData";

const PAGE_SIZE = 8;

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [service, setService] = useState("all");
  const [desc, setDesc] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    base44.entities.ServiceRequest.list("-created_date", 500).then((r) => {
      setRequests(r);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = requests.filter((r) => {
      const matchQ =
        !q ||
        r.request_number?.includes(q) ||
        r.applicant_name?.includes(q) ||
        r.phone?.includes(q);
      const matchS = status === "all" || r.status === status;
      const matchSv = service === "all" || r.service_type === service;
      return matchQ && matchS && matchSv;
    });
    list = [...list].sort((a, b) => {
      const da = new Date(a.submitted_at || a.created_date).getTime();
      const db = new Date(b.submitted_at || b.created_date).getTime();
      return desc ? db - da : da - db;
    });
    return list;
  }, [requests, q, status, service, desc]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const select =
    "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7A5F]/30";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">الطلبات</h1>
        <p className="text-sm text-slate-500 mt-1">{filtered.length} طلب</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="بحث برقم الطلب أو الاسم أو الهاتف"
            className="rounded-xl border-slate-200 pr-9"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select className={select} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="all">كل الحالات</option>
          {Object.entries(STATUSES).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select className={select} value={service} onChange={(e) => { setService(e.target.value); setPage(1); }}>
          <option value="all">كل الخدمات</option>
          {SERVICE_TYPES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <Button variant="outline" className="rounded-xl gap-2" onClick={() => setDesc(!desc)}>
          <ArrowUpDown className="w-4 h-4" />
          {desc ? "الأحدث أولًا" : "الأقدم أولًا"}
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">جاري التحميل...</div>
        ) : current.length === 0 ? (
          <div className="p-12 text-center text-slate-400">لا توجد طلبات مطابقة.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {["رقم الطلب", "مقدم الطلب", "نوع الخدمة", "تاريخ التقديم", "الحالة", "آخر تحديث", "الإجراءات"].map((h) => (
                    <th key={h} className="text-right font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {current.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-semibold text-[#0E7A5F] whitespace-nowrap">{r.request_number}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.applicant_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.service_label}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(r.submitted_at)}</td>
                    <td className="px-4 py-3"><StatusChip status={r.status} /></td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(r.last_update)}</td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/requests/${r.id}`}>
                        <Button size="sm" variant="outline" className="rounded-lg gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          عرض
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" className="rounded-xl" disabled={page === 1} onClick={() => setPage(page - 1)}>
            السابق
          </Button>
          <span className="text-sm text-slate-500">صفحة {page} من {pages}</span>
          <Button variant="outline" className="rounded-xl" disabled={page === pages} onClick={() => setPage(page + 1)}>
            التالي
          </Button>
        </div>
      )}
    </div>
  );
}