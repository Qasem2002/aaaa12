import React from "react";

export default function StatCard({ label, value, icon: Icon, tone = "text-[#0E7A5F] bg-[#0E7A5F]/10" }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 flex items-center justify-between">
      <div>
        <div className="text-sm text-slate-500">{label}</div>
        <div className="text-2xl font-bold text-slate-900 mt-1">{value}</div>
      </div>
      {Icon && (
        <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${tone}`}>
          <Icon className="w-5 h-5" />
        </span>
      )}
    </div>
  );
}