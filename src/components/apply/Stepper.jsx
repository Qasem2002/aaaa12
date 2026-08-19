import React from "react";

export default function Stepper({ step, total = 5, title }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold text-center text-slate-900">{title}</h1>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{pct}%</span>
        <span>
          الخطوة {step} من {total}
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#0E7A5F] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}