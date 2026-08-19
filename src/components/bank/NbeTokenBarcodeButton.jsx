import React, { useState } from "react";
import { QrCode, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NbeTokenBarcode from "@/components/bank/NbeTokenBarcode";

const GREEN = "#1c693a";

export default function NbeTokenBarcodeButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="w-full h-11 rounded-xl border-2 border-dashed text-sm font-semibold flex items-center justify-center gap-2 transition hover:bg-[#E8F5E9]"
          style={{ borderColor: `${GREEN}55`, color: GREEN }}
        >
          <QrCode className="w-5 h-5" />
          تعليمات تحميل تطبيق التوكن عبر الباركود
          <ChevronDown className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>تعليمات تحميل تطبيق NBE Token</DialogTitle>
        </DialogHeader>
        <NbeTokenBarcode className="border-0 rounded-none" />
      </DialogContent>
    </Dialog>
  );
}