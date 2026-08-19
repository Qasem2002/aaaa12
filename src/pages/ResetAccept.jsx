import React from "react";
import VerifyResult from "@/components/bank/VerifyResult";

export default function ResetAccept() {
  return (
    <VerifyResult
      status="accept"
      title="تم تأكيد التوكن"
      message="تم التحقق من رمز التوكن بنجاح، وتمت المصادقة على جهاز الأمان."
      actionLabel="العودة للبوابة"
      actionTo="/portal"
    />
  );
}