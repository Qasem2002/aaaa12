import React from "react";
import VerifyResult from "@/components/bank/VerifyResult";

export default function ResetReject() {
  return (
    <VerifyResult
      status="reject"
      title="رمز التوكن غير صحيح"
      message="رمز التوكن غير صحيح أو منتهي الصلاحية. يرجى إعادة المحاولة."
      actionLabel="إعادة المحاولة"
      actionTo="/reset-password"
    />
  );
}