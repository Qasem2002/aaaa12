import React from "react";
import { QrCode, Smartphone, Download } from "lucide-react";
import { Image } from "@/components/ui/image";

const NBE_TOKEN_BARCODE =
  "https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=8&color=1c693a&bgcolor=ffffff&data=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.NBEProdToken";

const instructions = [
  {
    icon: Smartphone,
    title: "حمّل تطبيق NBE Token",
    text: "حمّل التطبيق من Google Play أو App Store على هاتفك الذكي.",
  },
  {
    icon: QrCode,
    title: "افتح التطبيق وفعّل التوكن",
    text: "سجّل الدخول ببياناتك المصرفية ثم فعّل خدمة التوكن من خلال فرع البنك أو الإنترنت المصرفي.",
  },
  {
    icon: Download,
    title: "احصل على الباركود",
    text: "من داخل التطبيق، انتقل إلى قسم «التوكن» وستظهر لك شاشة تحتوي على الرمز المكوّن من 8 أرقام يتجدد كل 30 ثانية.",
  },
];

export default function NbeTokenBarcode({ className = "" }) {
  return (
    <div className={`rounded-2xl bg-white border border-[#cfe9d6] p-6 space-y-5 text-right ${className}`}>
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5E9" }}>
          <QrCode className="w-5 h-5" style={{ color: "#1c693a" }} />
        </span>
        <div className="leading-tight">
          <div className="font-bold" style={{ color: "#1c693a" }}>باركود تطبيق NBE Token</div>
          <div className="text-xs text-[#777777]">كيفية الحصول على الباركود وتحميل التطبيق</div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 py-2">
        <div className="w-40 h-40 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden p-2">
          <Image
            src={NBE_TOKEN_BARCODE}
            alt="باركود NBE Token"
            className="w-full h-full object-contain"
            fittingType="fit"
          />
        </div>
        <p className="text-xs text-[#777777] text-center">
          امسح الباركود بكاميرا هاتفك للانتقال مباشرةً لتحميل التطبيق
        </p>
      </div>

      <div className="space-y-3">
        {instructions.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="flex items-start gap-3">
              <span
                className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: "#1c693a" }}
              >
                <Icon className="w-4 h-4" />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-[#333333]">{s.title}</div>
                <div className="text-xs text-[#777777] mt-0.5">{s.text}</div>
              </div>
            </div>
          );
        })}
      </div>


    </div>
  );
}