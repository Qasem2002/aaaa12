import React from "react";
import { STATUSES } from "@/lib/bankData";

export default function StatusChip({ status }) {
  const s = STATUSES[status] || STATUSES.new;
  return (
    <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-medium ${s.chip}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}