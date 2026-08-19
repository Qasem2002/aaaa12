import React from "react";
import VerifyResult from "@/components/bank/VerifyResult";

export default function ForgotAccept() {
  return (
    <VerifyResult
      status="accept"
      title="تم تأكيد رمز التحقق"
      message="تم التحقق من الرمز بنجاح، يمكنك الآن المتابعة إلى حسابك."
      actionLabel="العودة للبوابة"
      actionTo="/portal"
    />
  );
}