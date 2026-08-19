import React, { useEffect, useState, useCallback, useRef } from "react";
import { Radio, MapPin, Monitor, Users } from "lucide-react";
import { base44 } from "@/api/base44Client";

const ACTIVE_WINDOW_MS = 60 * 1000;

const PAGE_LABELS = {
  "/": "الصفحة الرئيسية",
  "/portal": "بوابة الدخول",
  "/register": "التسجيل",
  "/login": "صفحة الانتظار",
  "/apply": "تقديم طلب",
  "/forgot-password": "رمز التحقق",
  "/reset-password": "رمز التوكن",
};

function pageLabel(path) {
  if (PAGE_LABELS[path]) return PAGE_LABELS[path];
  if (path?.startsWith("/track")) return "تتبع الطلب";
  if (path?.startsWith("/admin")) return "لوحة الإدارة";
  return path || "—";
}

export default function ActiveVisitorsDropdown() {
  const [visitors, setVisitors] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const r = await base44.entities.VisitorSession.list("-last_seen", 200);
      const now = Date.now();
      setVisitors(
        r.filter(
          (v) => v.is_active && now - new Date(v.last_seen).getTime() < ACTIVE_WINDOW_MS
        )
      );
    } catch {}
  }, []);

  useEffect(() => {
    load();
    const unsub = base44.entities.VisitorSession.subscribe(() => load());
    const interval = setInterval(load, 15000);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [load]);

  return (
    <div
      ref={wrapRef}
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition"
      >
        <Radio className="w-3.5 h-3.5 animate-pulse" />
        الزوار النشطون
        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-emerald-600 text-white text-[11px]">
          {visitors.length}
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 left-0 w-72 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          <div className="px-3 py-2.5 border-b border-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-slate-800">الزوار النشطون داخل الموقع</span>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {visitors.length === 0 ? (
              <div className="text-center text-xs text-slate-400 py-6">
                لا يوجد زوار نشطون حالياً.
              </div>
            ) : (
              visitors.map((v) => (
                <div key={v.id} className="px-3 py-2.5 border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium truncate">{v.location || "غير معروف"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 pr-4">
                    <Monitor className="w-3 h-3 shrink-0" />
                    <span className="truncate">{pageLabel(v.current_page)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}