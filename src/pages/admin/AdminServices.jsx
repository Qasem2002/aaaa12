import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Power } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export default function AdminServices() {
  const { toast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", required_fields: "" });

  const load = async () => {
    setLoading(true);
    setServices(await base44.entities.BankService.list("-created_date"));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing("new");
    setForm({ name: "", description: "", required_fields: "" });
  };

  const save = async () => {
    if (!form.name) return toast({ title: "اسم الخدمة مطلوب", variant: "destructive" });
    const payload = {
      name: form.name,
      description: form.description,
      required_fields: form.required_fields.split(",").map((s) => s.trim()).filter(Boolean),
    };
    if (editing === "new") await base44.entities.BankService.create({ ...payload, active: true });
    else await base44.entities.BankService.update(editing, payload);
    setEditing(null);
    await load();
    toast({ title: "تم حفظ الخدمة" });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">الخدمات</h1>
          <p className="text-sm text-slate-500 mt-1">إدارة الخدمات التجريبية المتاحة</p>
        </div>
        <Button onClick={openNew} className="bg-[#0E7A5F] hover:bg-[#0b6450] rounded-xl gap-2">
          <Plus className="w-4 h-4" />
          إضافة خدمة
        </Button>
      </div>

      {editing && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="font-semibold text-slate-800">{editing === "new" ? "خدمة جديدة" : "تعديل الخدمة"}</h2>
          <Input placeholder="اسم الخدمة" className="rounded-xl border-slate-200" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Textarea placeholder="وصف الخدمة" className="rounded-xl border-slate-200" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input placeholder="الحقول المطلوبة (مفصولة بفاصلة)" className="rounded-xl border-slate-200" value={form.required_fields} onChange={(e) => setForm({ ...form, required_fields: e.target.value })} />
          <div className="flex gap-3">
            <Button onClick={save} className="bg-[#0E7A5F] hover:bg-[#0b6450] rounded-xl">حفظ</Button>
            <Button variant="outline" className="rounded-xl" onClick={() => setEditing(null)}>إلغاء</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-slate-400">جاري التحميل...</div>
      ) : services.length === 0 ? (
        <div className="py-16 text-center text-slate-400 rounded-2xl border border-slate-200 bg-white">لا توجد خدمات بعد.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((s) => (
            <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{s.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{s.description || "—"}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border ${s.active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                  {s.active ? "مفعّلة" : "معطلة"}
                </span>
              </div>
              {s.required_fields?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {s.required_fields.map((f) => (
                    <span key={f} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{f}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" className="rounded-lg gap-1.5" onClick={() => { setEditing(s.id); setForm({ name: s.name, description: s.description || "", required_fields: (s.required_fields || []).join(", ") }); }}>
                  <Pencil className="w-3.5 h-3.5" /> تعديل
                </Button>
                <Button size="sm" variant="outline" className="rounded-lg gap-1.5" onClick={async () => { await base44.entities.BankService.update(s.id, { active: !s.active }); load(); }}>
                  <Power className="w-3.5 h-3.5" /> {s.active ? "تعطيل" : "تفعيل"}
                </Button>
                <Button size="sm" variant="outline" className="rounded-lg gap-1.5 text-red-600 hover:text-red-700" onClick={async () => { await base44.entities.BankService.delete(s.id); load(); toast({ title: "تم حذف الخدمة" }); }}>
                  <Trash2 className="w-3.5 h-3.5" /> حذف
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}