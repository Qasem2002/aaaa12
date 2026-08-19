import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import DemoBanner from "@/components/bank/DemoBanner";
import PortalLogo from "@/components/bank/PortalLogo";
import { PRIVACY_NOTE } from "@/lib/bankData";

export default function VerifyResult({ status, title, message, actionLabel, actionTo, retryTo }) {
  const ok = status === "accept";
  const color = ok ? "#1c693a" : "#c0392b";
  const Icon = ok ? CheckCircle2 : XCircle;
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <DemoBanner />
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex justify-center">
            <PortalLogo />
          </div>

          <div className="flex justify-center">
            <span
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ backgroundColor: ok ? "#E8F5E9" : "#fdecea" }}
            >
              <Icon className="w-12 h-12" style={{ color }} />
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold" style={{ color }}>{title}</h1>
            <p className="text-sm text-[#777777] leading-relaxed">{message}</p>
          </div>

          <div className="space-y-3">
            <Link
              to={actionTo}
              className="w-full h-12 rounded-xl font-bold text-white flex items-center justify-center"
              style={{ backgroundColor: color }}
            >
              {actionLabel}
            </Link>
            {retryTo && (
              <Link to={retryTo} className="block text-sm text-slate-500 hover:underline">إعادة المحاولة</Link>
            )}
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-500">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{PRIVACY_NOTE}</span>
          </div>
        </div>
      </div>
    </div>
  );
}