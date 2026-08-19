import React from "react";
import { Sparkles } from "lucide-react";

const PROMO =
  "عرض لفترة محدودة — سارع بطلبك الآن واحصل على فرصة الدخول في سحب على جوائز عديدة وقيمة";

export default function DemoBanner() {
  return (
    <div className="w-full bg-gradient-to-l from-[#1B5E20] via-[#2E7D32] to-[#D97706] text-white overflow-hidden">
      <div className="flex items-center">
        <Sparkles className="w-4 h-4 shrink-0 mx-3" />
        <div className="overflow-hidden flex-1">
          <div className="flex whitespace-nowrap animate-marquee">
            <span className="px-8 text-sm font-semibold">{PROMO}</span>
            <span className="px-8 text-sm font-semibold">{PROMO}</span>
          </div>
        </div>
      </div>
    </div>
  );
}