import React, { useEffect, useState, useCallback } from "react";
import { MapPin, Monitor, Clock, Users, Radio } from "lucide-react";
import { base44 } from "@/api/base44Client";

const ACTIVE_WINDOW_MS = 60 * 1000;

function playVisitorSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + i * 0.13;
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.32, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.11);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.11);
    });
  } catch {}
}

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

export default function ActiveVisitors() {
  const [visitors, setVisitors] = useState([]);
  const myId = sessionStorage.getItem("visitor_id");

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
    const unsub = base44.entities.VisitorSession.subscribe((event) => {
      if (event.type === "create" && event.data?.session_id !== myId) {
        playVisitorSound();
      }
      load();
    });
    const interval = setInterval(load, 15000);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [load, myId]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#0E7A5F]" />
          <h2 className="font-semibold text-slate-800">الزوار النشطون</h2>
        </div>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          {visitors.length} متصل الآن
        </span>
      </div>

      {visitors.length === 0 ? (
        <div className="text-center text-sm text-slate-400 py-6">
          لا يوجد زوار نشطون حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visitors.map((v) => (
            <div
              key={v.id}
              className="rounded-xl border border-slate-200 p-3 space-y-2 bg-slate-50/50"
            >
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <MapPin className="w-4 h-4 text-[#0E7A5F] shrink-0" />
                <span className="font-medium truncate">{v.location || "غير معروف"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Monitor className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{pageLabel(v.current_page)}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Clock className="w-3 h-3 shrink-0" />
                <span>آخر نشاط: {new Date(v.last_seen).toLocaleTimeString("ar")}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}