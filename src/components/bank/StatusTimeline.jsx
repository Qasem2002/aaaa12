import React from "react";
import { Check, Clock, Circle, XCircle } from "lucide-react";
import { timelineFor } from "@/lib/bankData";

export default function StatusTimeline({ status }) {
  if (status === "rejected") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-red-700">
        <XCircle className="w-5 h-5" />
        <span className="font-medium">تم رفض الطلب — يرجى مراجعة ملاحظات الإدارة.</span>
      </div>
    );
  }
  const steps = timelineFor(status);
  return (
    <ol className="space-y-2">
      {steps.map((s) => (
        <li
          key={s.key}
          className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
            s.state === "done"
              ? "border-emerald-200 bg-emerald-50/60"
              : s.state === "current"
              ? "border-[#0E7A5F]/30 bg-white"
              : "border-slate-100 bg-slate-50"
          }`}
        >
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
              s.state === "done"
                ? "bg-emerald-500 text-white"
                : s.state === "current"
                ? "bg-[#0E7A5F] text-white"
                : "bg-slate-200 text-slate-400"
            }`}
          >
            {s.state === "done" ? (
              <Check className="w-4 h-4" />
            ) : s.state === "current" ? (
              <Clock className="w-4 h-4 animate-pulse" />
            ) : (
              <Circle className="w-3 h-3" />
            )}
          </span>
          <span className={s.state === "pending" ? "text-slate-400" : "text-slate-800 font-medium"}>
            {s.label}
          </span>
        </li>
      ))}
    </ol>
  );
}