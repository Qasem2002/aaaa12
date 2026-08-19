import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import BankLogo from "@/components/bank/BankLogo";
import DemoBanner from "@/components/bank/DemoBanner";
import { PRIVACY_NOTE } from "@/lib/bankData";

const BASE = "https://base44.app/api/apps/6a7f4afef2496ec0c88a79b5/files/mp/public/6a7f4afef2496ec0c88a79b5";

const ALL_COLORS = [
  { name: "وردي ناعم", desc: "رومانسية وأنوثة", hex: "#f4b6c2", img: `${BASE}/9c7500547_watch_pink.webp` },
  { name: "أخضر عسكري", desc: "قوة وأناقة عسكرية", hex: "#4b5320", img: `${BASE}/558df2bc6_watch_green.webp` },
  { name: "أحمر جريء", desc: "جرأة باللون الأحمر", hex: "#c0392b", img: `${BASE}/e3ccbbb60_watch_red.webp` },
  { name: "أزرق ملكي", desc: "أناقة ملكية زرقاء", hex: "#27408b", img: `${BASE}/976984ef6_watch_blue.webp` },
  { name: "برتقالي", desc: "حيوية برتقالية مميزة", hex: "#e8843a", img: `${BASE}/4aeebc6a0_watch_orange.webp` },
  { name: "فضي أنيق", desc: "نقاء فضي راق", hex: "#cfd2d6", img: `${BASE}/6ac50d68e_watch_silver.webp` },
  { name: "ذهبي فاخر", desc: "فخامة ذهبية لا مثيل لها", hex: "#c9a24b", img: `${BASE}/8d1038e0b_watch_gold.webp` },
  { name: "أسود كلاسيكي", desc: "أناقة كلاسيكية داكنة", hex: "#1c1c1c", img: `${BASE}/5af5bf2f6_watch_black.webp` },
  { name: "تركيواز", desc: "انتعاش فيروزي مميز", hex: "#3fb8af", img: `${BASE}/198069d27_watch_teal.webp` },
  { name: "روز جولد", desc: "رومانسية ذهبية وردية", hex: "#e8b7b2", img: `${BASE}/e8b6e59cf_watch_rosegold.webp` },
  { name: "بني جلد", desc: "دفء بني كلاسيكي", hex: "#6f4e37", img: `${BASE}/a42e1aa2e_watch_brown.webp` },
  { name: "أبيض نقي", desc: "نقاء أبيض ناصع", hex: "#f4f4f4", img: `${BASE}/10ed4a7a2_watch_white.webp` },
  { name: "بنفسجي غامق", desc: "غموض وفخامة بنفسجية", hex: "#5b2c6f", img: `${BASE}/2c095ba19_watch_purple.webp` },
];

const HERO_NAMES = ["أسود كلاسيكي", "ذهبي فاخر", "فضي أنيق", "برتقالي", "أزرق ملكي"];
const HERO_COLORS = HERO_NAMES.map((n) => ALL_COLORS.find((c) => c.name === n));

function useCountdown(seconds) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setLeft((l) => (l > 0 ? l - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(left / 3600)).padStart(2, "0");
  const m = String(Math.floor((left % 3600) / 60)).padStart(2, "0");
  const s = String(left % 60).padStart(2, "0");
  return { h, m, s };
}

export default function Home() {
  const navigate = useNavigate();
  const [heroColor, setHeroColor] = useState("ذهبي فاخر");
  const [gridColor, setGridColor] = useState("ذهبي فاخر");
  const { h, m, s } = useCountdown(3 * 3600 + 59 * 60 + 33);

  const order = () => navigate("/apply");
  const heroImg = ALL_COLORS.find((c) => c.name === heroColor).img;
  const heroDesc = ALL_COLORS.find((c) => c.name === heroColor).desc;

  return (
    <div className="min-h-screen bg-[#fdfdfd] flex flex-col">
      <DemoBanner />

      {/* Nav */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <BankLogo />
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" className="rounded-full border-slate-200 hidden sm:inline-flex" onClick={() => document.getElementById("colors")?.scrollIntoView({ behavior: "smooth" })}>
              عرض جميع الألوان ←
            </Button>
            <Button onClick={order} className="rounded-full bg-[#3A6B41] hover:bg-[#2f5735] px-5">
              اطلب ساعتك الآن
            </Button>
          </div>
        </div>
      </header>

      {/* Countdown */}
      <div className="bg-[#3A6B41] text-white">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2 text-sm text-center">
          <span>عرض حصري لعملاء البنك — ينتهي خلال:</span>
          <span className="font-bold tabular-nums tracking-wide" dir="ltr">
            {h} ساعة : {m} دقيقة : {s} ثانية
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-10 sm:py-14 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Right (text) */}
          <div className="order-2 md:order-1 space-y-5 text-center md:text-right">
            <span className="inline-block text-xs font-semibold text-[#A68958] border border-[#A68958]/40 rounded-full px-3 py-1">
              عرض حصري 2025
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-[#1A1A1A]">
              ساعة البنك الذكية
              <br />
              <span className="text-[#3A6B41]">ادفع بلمسة واحدة من معصمك</span>
            </h1>
            <p className="text-slate-500">متوفرة بأكثر من 12 لوناً مميزاً</p>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {HERO_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setHeroColor(c.name)}
                  className={`rounded-full px-4 py-2 text-sm border transition-all ${
                    heroColor === c.name
                      ? "border-[#3A6B41] bg-[#3A6B41]/5 text-[#3A6B41] font-semibold"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => document.getElementById("colors")?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm text-[#3A6B41] underline decoration-dashed underline-offset-4 hover:opacity-80"
            >
              عرض جميع الألوان ←
            </button>

            <div>
              <Button onClick={order} className="rounded-full bg-[#3A6B41] hover:bg-[#2f5735] px-8 py-6 text-base shadow-lg shadow-[#3A6B41]/20">
                اطلب ساعتك الآن
              </Button>
            </div>
          </div>

          {/* Left (image) */}
          <div className="order-1 md:order-2 flex flex-col items-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-[#f5efe6] to-[#ece3d4] flex items-center justify-center shadow-inner">
              <Image src={heroImg} alt={heroColor} className="w-48 h-48 sm:w-60 sm:h-60 object-contain" fittingType="fit" />
              <span className="absolute top-4 left-4 bg-[#3A6B41] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                مجاناً!
              </span>
            </div>
            <div className="mt-4 text-center">
              <div className="font-bold text-[#1A1A1A]">{heroColor}</div>
              <div className="text-sm text-slate-400">{heroDesc}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Colors grid */}
      <section id="colors" className="max-w-6xl mx-auto px-4 py-10 w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">اختر لون ساعتك المفضل ←</h2>
          <p className="text-slate-500 mt-2">كل ألوان الكولكشن متاحة — اختر ما يناسب أسلوبك</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {ALL_COLORS.map((c) => {
            const selected = gridColor === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setGridColor(c.name)}
                className={`relative bg-white rounded-2xl p-4 flex flex-col items-center gap-3 shadow-sm transition-all text-center ${
                  selected ? "ring-2 ring-[#b8860b] border-transparent" : "border border-slate-100 hover:shadow-md"
                }`}
              >
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden">
                  <Image src={c.img} alt={c.name} className="w-16 h-16 object-contain" fittingType="fit" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#1A1A1A]">{c.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{c.desc}</div>
                </div>
                {selected && (
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[#b8860b] bg-[#b8860b]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> مختار
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <Button onClick={order} className="w-full sm:w-auto sm:mx-auto sm:block rounded-xl bg-[#3A6B41] hover:bg-[#2f5735] px-10 py-6 text-base">
            اطلب ساعتك الآن
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center space-y-2">
          <BankLogo compact />
          <p className="text-xs text-slate-500 pt-2">{PRIVACY_NOTE}</p>
        </div>
      </footer>
    </div>
  );
}