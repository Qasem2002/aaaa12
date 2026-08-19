import React from "react";

export default function PortalLogo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <img
          src="https://media.base44.com/images/public/6a7f4afef2496ec0c88a79b5/650965b0a_NBE_logo.svg"
          alt="National Bank ahli"
          className="h-9 w-auto object-contain"
        />
        <div className="leading-tight">
          <div className="text-[15px] font-extrabold text-[#2D6A4F]">National Bank ahli</div>
          <div className="text-[10px] font-semibold text-slate-400 tracking-wide">البنك الأهلي المصري</div>
        </div>
      </div>
    </div>
  );
}