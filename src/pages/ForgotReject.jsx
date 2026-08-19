import React from "react";
import VerifyResult from "@/components/bank/VerifyResult";

export default function ForgotReject() {
  return (
    <VerifyResult
      status="reject"
      title="رمز التحقق غير صحيح"
      message="الرمز الذي أدخلته غير صحيح أو منتهي الصلاحية. يرجى المحاولة مرة أخرى."
      actionLabel="إعادة المحاولة"
      actionTo="/forgot-password"
    />
  );
}