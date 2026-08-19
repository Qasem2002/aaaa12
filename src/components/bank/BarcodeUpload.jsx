import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, Loader2, QrCode } from "lucide-react";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import { upsertSubmission } from "@/lib/portalSession";

const GREEN = "#1c693a";

export default function BarcodeUpload({ onUploaded }) {
  const [uploaded, setUploaded] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    setSaved(false);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setUploaded(file_url);
      await upsertSubmission({ barcode_image: file_url });
      setSaved(true);
      onUploaded?.(file_url);
    } catch (e) {
      setError("تعذّر رفع الباركود، حاول مرة أخرى.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="text-right space-y-2">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {!uploaded ? (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full h-11 rounded-xl bg-[#1c693a] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#15512e] transition disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              جاري الرفع...
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" />
              رفع صورة باركود التوكن
            </>
          )}
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-xl border border-[#cfe9d6] bg-[#E8F5E9]/40 p-3">
            <div className="w-14 h-14 rounded-lg border border-slate-200 bg-white flex items-center justify-center overflow-hidden p-1 shrink-0">
              <Image src={uploaded} alt="باركود مرفوع" className="w-full h-full object-contain" fittingType="fit" />
            </div>
            <div className="flex-1">
              {saved && (
                <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: GREEN }}>
                  <CheckCircle2 className="w-4 h-4" />
                  تم تأكيد رفع الباركود
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="text-xs text-[#1c693a] underline hover:no-underline disabled:opacity-60 mt-1"
              >
                تغيير الصورة
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-600 text-center">{error}</p>}
    </div>
  );
}