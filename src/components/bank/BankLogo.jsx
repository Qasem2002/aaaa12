import React from "react";
import { BANK_NAME } from "@/lib/bankData";

export default function BankLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="https://media.base44.com/images/public/6a7f4afef2496ec0c88a79b5/650965b0a_NBE_logo.svg"
        alt={BANK_NAME}
        className="h-11 w-auto object-contain"
      />
    </div>
  );
}