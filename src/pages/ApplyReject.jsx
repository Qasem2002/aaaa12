import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { XCircle, Info } from "lucide-react";
import DemoBanner from "@/components/bank/DemoBanner";
import PortalLogo from "@/components/bank/PortalLogo";
import { PRIVACY_NOTE } from "@/lib/bankData";

const RED = "#c0392b";

export default function ApplyReject() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("last_request");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch {}
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoBanner />
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex justify-center">
        <PortalLogo />
      </header>

      <div className="flex-1 flex justify-center px-4 py-8">
        <div className="w-full max-w-lg space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center space-y-5">
            <div className="flex justify-center">
              <span
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#FDEDED" }}
              >
                <XCircle className="w-11 h-11" style={{ color: RED }} />
              </span>
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-slate-900">تم رفض طلبك</h1>
              <p className="text-sm text-slate-500">
                نأسف، لم تتم الموافقة على طلبك في نظام المحاكاة.
              </p>
            </div>
            {data?.reqNumber && (
              <div className="rounded-xl p-4" style={{ backgroundColor: "#FDEDED" }}>
                <div className="text-xs text-slate-500 mb-1">رقم الطلب</div>
                <div className="text-2xl font-bold tracking-wide" style={{ color: RED }}>
                  {data.reqNumber}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Link
              to="/"
              className="w-full h-12 rounded-xl font-bold border border-slate-200 text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50"
            >
              العودة للرئيسية
            </Link>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{PRIVACY_NOTE}</span>
          </div>
        </div>
      </div>
    </div>
  );
}