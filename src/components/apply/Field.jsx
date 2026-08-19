import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Field({ label, hint, type = "text", value, onChange, placeholder, options, maxLength, inputMode }) {
  const base =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7A5F]/30 focus:border-[#0E7A5F]";
  return (
    <div className="space-y-2">
      <Label className="text-slate-700">{label}</Label>
      {type === "select" ? (
        <select className={base} value={value || ""} onChange={(e) => onChange(e.target.value)}>
          <option value="">اختر...</option>
          {(options || []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <Textarea
          className="rounded-xl border-slate-200 min-h-24"
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Input
          type={type}
          inputMode={inputMode}
          maxLength={maxLength}
          className="rounded-xl border-slate-200 py-6"
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}