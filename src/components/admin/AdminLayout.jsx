import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ClipboardList,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import BankLogo from "@/components/bank/BankLogo";
import DemoBanner from "@/components/bank/DemoBanner";

const items = [
  { to: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { to: "/admin/requests", label: "الطلبات", icon: FileText },
  { to: "/admin/submissions", label: "البيانات المقدمة", icon: ClipboardList },
  { to: "/admin/users", label: "المستخدمون التجريبيون", icon: Users },
  { to: "/admin/services", label: "الخدمات", icon: Package },
  { to: "/admin/notifications", label: "الإشعارات", icon: Bell },
  { to: "/admin/reports", label: "التقارير", icon: BarChart3 },
  { to: "/admin/settings", label: "إعدادات النظام", icon: Settings },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="space-y-1">
      {items.map((i) => {
        const active = pathname === i.to;
        return (
          <Link
            key={i.to}
            to={i.to}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
              active ? "bg-[#0E7A5F] text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <i.icon className="w-4 h-4" />
            {i.label}
          </Link>
        );
      })}
      <button
        onClick={() => {
          sessionStorage.removeItem("admin_auth");
          localStorage.removeItem("demo_session");
          navigate("/admin/login");
        }}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50"
      >
        <LogOut className="w-4 h-4" />
        تسجيل الخروج
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <DemoBanner />
      <div className="flex">
        <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-l border-slate-200 min-h-[calc(100vh-40px)] p-4 gap-6 sticky top-0">
          <BankLogo />
          {nav}
        </aside>

        <div className="flex-1 min-w-0">
          <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <BankLogo compact />
            <button onClick={() => setOpen(!open)} className="p-2 text-slate-600">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </header>
          {open && <div className="lg:hidden bg-white border-b border-slate-200 p-4">{nav}</div>}
          <main className="p-4 sm:p-6 max-w-7xl mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}