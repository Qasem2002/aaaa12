import React from "react";

const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.NBEProdToken";
const APP_STORE_URL = "https://apps.apple.com/us/app/nbe-token/id1598804254";

export function GooglePlayBadge({ className = "" }) {
  return (
    <a
      href={GOOGLE_PLAY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`h-11 rounded-xl bg-black text-white flex items-center justify-center gap-2 px-3 hover:opacity-90 transition ${className}`}
    >
      <svg viewBox="0 0 512 512" className="w-6 h-6" fill="currentColor" aria-hidden="true">
        <path d="M325.3 234.3 104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6-95.2-54.1-67.2 67.2 67.2 67.2 95.2-54.1c13.5-7.7 13.5-26.2 0-33.9zM104.6 499l220.7-221.3 60.1 60.1L104.6 499z"/>
      </svg>
      <span className="text-[10px] leading-none text-right">
        <div className="opacity-70 text-[8px]">GET IT ON</div>
        <div className="font-semibold text-sm">Google Play</div>
      </span>
    </a>
  );
}

export function AppStoreBadge({ className = "" }) {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`h-11 rounded-xl bg-black text-white flex items-center justify-center gap-2 px-3 hover:opacity-90 transition ${className}`}
    >
      <svg viewBox="0 0 384 512" className="w-6 h-6" fill="currentColor" aria-hidden="true">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-73.4-19.7C58.2 141.2 0 184.8 0 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.8 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.8 90.4-82.5 102.6-119.3-65.2-30.7-57.7-90-57.7-91.9zm-55-169.9c25.8-30.7 23.5-58.6 22.7-68.7-22.8 1.3-49.2 15.5-64.2 33.2-16.5 18.8-26.2 41.9-24 67.4 24.7 1.9 47.2-10.7 65.5-31.9z"/>
      </svg>
      <span className="text-[10px] leading-none text-right">
        <div className="opacity-70 text-[8px]">Download on the</div>
        <div className="font-semibold text-sm">App Store</div>
      </span>
    </a>
  );
}

export default function StoreBadges({ className = "" }) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      <GooglePlayBadge />
      <AppStoreBadge />
    </div>
  );
}