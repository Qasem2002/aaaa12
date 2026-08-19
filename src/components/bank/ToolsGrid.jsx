import React from "react";
import { Calculator, Coins, Landmark, PiggyBank, MapPin, CalendarClock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const tools = [
  { icon: Calculator, label: "حاسبة الأقساط" },
  { icon: Coins, label: "حاسبة العملات" },
  { icon: Landmark, label: "حاسبة القروض" },
  { icon: PiggyBank, label: "حاسبة الودائع" },
  { icon: MapPin, label: "البحث عن ماكينة صراف" },
  { icon: CalendarClock, label: "حجز موعد" },
];

export default function ToolsGrid() {
  const { toast } = useToast();
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-2">
      {tools.map((t) => (
        <button
          key={t.label}
          onClick={() =>
            toast({ title: t.label, description: "أداة تعليمية توضيحية — غير مفعّلة في نظام المحاكاة." })
          }
          className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-colors text-center"
        >
          <span className="w-10 h-10 rounded-xl bg-[#0E7A5F]/10 text-[#0E7A5F] flex items-center justify-center">
            <t.icon className="w-5 h-5" />
          </span>
          <span className="text-[11px] text-slate-600 leading-tight">{t.label}</span>
        </button>
      ))}
    </div>
  );
}