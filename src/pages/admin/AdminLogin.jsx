import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BankLogo from "@/components/bank/BankLogo";

const ADMIN_USER = "hasoon";
const ADMIN_PASS = "Qq112233##";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("يرجى إدخال اسم المستخدم وكلمة المرور.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (username.trim() === ADMIN_USER && password === ADMIN_PASS) {
        sessionStorage.setItem("admin_auth", "1");
        navigate("/admin");
      } else {
        setError("بيانات الدخول غير صحيحة.");
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex justify-center">
          <BankLogo />
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-lg font-bold text-slate-900">لوحة تحكم الإدارة</h1>
          <p className="text-sm text-slate-500">سجّل الدخول للوصول إلى لوحة التحكم</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <User className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="اسم المستخدم"
              className="rounded-xl border-slate-200 py-6 pr-10"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type={show ? "text" : "password"}
              placeholder="كلمة المرور"
              className="rounded-xl border-slate-200 py-6 pr-10 pl-10"
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
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-6 text-base bg-[#0E7A5F] hover:bg-[#0b6450]"
          >
            {loading ? "جاري التحقق..." : "تسجيل الدخول"}
          </Button>
        </form>
      </div>
    </div>
  );
}