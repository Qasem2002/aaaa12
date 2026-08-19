export const BANK_NAME = "National Bank ahli";
export const DISCLAIMER =
  "هذا النظام محاكاة تعليمية ولا يمثل مؤسسة مالية حقيقية. جميع البيانات وهمية.";

export const PRIVACY_NOTE =
  "خصوصيتك أمانة — لا نقوم بحفظ أي بيانات تقدمها على خوادمنا.";

export const DEMO_CREDS = { username: "demo", password: "demo123" };

export const NBE_BRANCHES = [
  "الفرع الرئيسي - القاهرة (الأهرام)",
  "فرع المقطم",
  "فرع مدينة نصر",
  "فرع مصر الجديدة",
  "فرع وسط البلد",
  "فرع الزمالك",
  "فرع المعادي",
  "فرع التجمع الخامس",
  "فرع 6 أكتوبر",
  "فرع الشيخ زايد",
  "فرع الجيزة (الهرم)",
  "فرع المهندسين",
  "فرع الإسكندرية (المنشية)",
  "فرع سموحة",
  "فرع المنتزه",
  "فرع بورسعيد",
  "فرع السويس",
  "فرع الإسماعيلية",
  "فرع دمياط",
  "فرع المنصورة",
  "فرع طنطا",
  "فرع المحلة الكبرى",
  "فرع دمنهور",
  "فرع كفر الشيخ",
  "فرع الفيوم",
  "فرع بني سويف",
  "فرع المنيا",
  "فرع أسيوط",
  "فرع سوهاج",
  "فرع قنا",
  "فرع الأقصر",
  "فرع أسوان",
];

export const GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "بورسعيد",
  "السويس",
  "دمياط",
  "الدقهلية",
  "الشرقية",
  "القليوبية",
  "المنوفية",
  "الغربية",
  "البحيرة",
  "الإسماعيلية",
  "كفر الشيخ",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
  "الوادي الجديد",
  "مطروح",
  "شمال سيناء",
  "جنوب سيناء",
  "البحر الأحمر",
];

export const SERVICE_TYPES = [
  {
    value: "open_account",
    label: "فتح حساب تجريبي",
    fields: [
      { name: "account_type", label: "نوع الحساب", type: "select", options: ["حساب جاري تجريبي", "حساب توفير تجريبي"] },
      { name: "currency", label: "العملة", type: "select", options: ["عملة تجريبية A", "عملة تجريبية B"] },
      { name: "monthly_income", label: "الدخل الشهري التقديري (وهمي)", type: "number" },
    ],
  },
  {
    value: "request_card",
    label: "طلب بطاقة تجريبية",
    fields: [
      { name: "card_type", label: "نوع البطاقة", type: "select", options: ["بطاقة تعليمية فضية", "بطاقة تعليمية ذهبية"] },
      { name: "delivery_pref", label: "طريقة الاستلام", type: "select", options: ["استلام من فرع تجريبي", "توصيل تجريبي"] },
    ],
  },
  {
    value: "loan",
    label: "طلب قرض تعليمي",
    fields: [
      { name: "amount", label: "قيمة القرض التجريبية", type: "number" },
      { name: "months", label: "مدة السداد (بالأشهر)", type: "number" },
      { name: "purpose", label: "الغرض من القرض", type: "text" },
    ],
  },
  {
    value: "certificate",
    label: "طلب شهادة",
    fields: [
      { name: "certificate_type", label: "نوع الشهادة", type: "select", options: ["شهادة ادخار تجريبية", "شهادة استثمار تجريبية"] },
      { name: "amount", label: "قيمة الشهادة التجريبية", type: "number" },
    ],
  },
  {
    value: "update_data",
    label: "تحديث بيانات",
    fields: [
      { name: "field_to_update", label: "البيان المطلوب تحديثه", type: "select", options: ["رقم الهاتف", "العنوان", "الاسم"] },
      { name: "new_value", label: "القيمة الجديدة (وهمية)", type: "text" },
    ],
  },
  {
    value: "other",
    label: "خدمة أخرى",
    fields: [{ name: "description", label: "وصف الخدمة المطلوبة", type: "textarea" }],
  },
];

export const STATUSES = {
  new: { label: "جديد", chip: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-400" },
  reviewing: { label: "قيد المراجعة", chip: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  approved: { label: "تمت الموافقة", chip: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  rejected: { label: "مرفوض", chip: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  info_requested: { label: "بحاجة لمعلومات", chip: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500" },
  completed: { label: "مكتمل", chip: "bg-slate-100 text-slate-700 border-slate-200", dot: "bg-slate-700" },
};

export const serviceLabel = (value) =>
  SERVICE_TYPES.find((s) => s.value === value)?.label || value;

export const serviceFields = (value) =>
  SERVICE_TYPES.find((s) => s.value === value)?.fields || [];

export const genRequestNumber = () =>
  `REQ-${Math.floor(10000 + Math.random() * 89999)}`;

export const formatDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleString("ar", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function timelineFor(status) {
  const order = ["received", "recorded", "reviewing", "approved", "completed"];
  const labels = {
    received: "تم استلام الطلب",
    recorded: "تم تسجيل بيانات الطلب",
    reviewing: "جاري مراجعة الطلب",
    approved: "تمت الموافقة",
    completed: "تم إكمال الطلب",
  };
  const reached = {
    new: 2,
    info_requested: 3,
    reviewing: 3,
    approved: 4,
    completed: 5,
    rejected: 3,
  }[status] || 2;
  return order.map((key, i) => ({
    key,
    label: labels[key],
    state: i + 1 < reached ? "done" : i + 1 === reached ? "current" : "pending",
  }));
}