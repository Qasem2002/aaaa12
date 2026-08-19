import React from "react";
import { Clock, Landmark, Calculator, BarChart3, Wallet, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function PortalBottomNav() {
  const { toast } = useToast();
  const items = [
    { icon: BarChart3, label: "حاسبة الأقساط" },
    { icon: Calculator, label: "حاسبة العملات" },
    { icon: Landmark, label: "ماكينة الصرف الآلي / الفرع" },
    { icon: Clock, label: "احجز موعد" },
  ];
  const notify = () =>
    toast({ title: "غير متاح", description: "أداة غير مفعّلة في نظام المحاكاة التعليمي." });
  return (
    <div className="border-t border-slate-100 pt-5 mt-6">
      <div className="grid grid-cols-4 gap-2">
        {items.map((it) => (
          <button key={it.label} onClick={notify} className="flex flex-col items-center gap-1.5 text-center">
            <span className="w-11 h-11 rounded-full bg-[#F2F2F2] flex items-center justify-center text-[#2D6A4F]">
              <it.icon className="w-5 h-5" />
            </span>
            <span className="text-[10px] text-slate-500 leading-tight">{it.label}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <button onClick={notify} className="w-10 h-10 rounded-full bg-[#F2F2F2] flex items-center justify-center text-[#2D6A4F]">
          <Wallet className="w-5 h-5" />
        </button>
        <button onClick={notify} className="w-10 h-10 rounded-full bg-[#F2F2F2] flex items-center justify-center text-[#2D6A4F]">
          <Building2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}