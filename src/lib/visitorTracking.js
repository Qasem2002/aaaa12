import { base44 } from "@/api/base44Client";

function getVisitorId() {
  let id = sessionStorage.getItem("visitor_id");
  if (!id) {
    id = "V-" + Math.floor(100000 + Math.random() * 900000);
    sessionStorage.setItem("visitor_id", id);
  }
  return id;
}

let locCache = null;
async function fetchLocation() {
  if (locCache) return locCache;
  try {
    const res = await Promise.race([
      fetch("https://ipapi.co/json/"),
      new Promise((_, rej) => setTimeout(() => rej("timeout"), 4000)),
    ]);
    const d = await res.json();
    const city = d.city || "";
    const country = d.country_name || "";
    locCache = {
      city,
      country,
      location: [city, country].filter(Boolean).join(", ") || "غير معروف",
    };
  } catch {
    locCache = { city: "", country: "", location: "غير معروف" };
  }
  return locCache;
}

let recordId = null;
let inFlight = false;
let pendingFields = null;

async function updateRecord(fields) {
  if (inFlight) {
    pendingFields = { ...(pendingFields || {}), ...fields };
    return;
  }
  inFlight = true;
  try {
    const id = getVisitorId();
    const now = new Date().toISOString();
    const loc = await fetchLocation();
    const payload = { ...fields, ...loc, last_seen: now, is_active: true };
    if (recordId) {
      await base44.entities.VisitorSession.update(recordId, payload);
    } else {
      const existing = await base44.entities.VisitorSession.filter(
        { session_id: id },
        "-created_date",
        1
      );
      if (existing.length > 0) {
        recordId = existing[0].id;
        await base44.entities.VisitorSession.update(recordId, payload);
      } else {
        const created = await base44.entities.VisitorSession.create({
          session_id: id,
          entered_at: now,
          ...payload,
        });
        recordId = created.id;
      }
    }
  } catch {}
  inFlight = false;
  if (pendingFields) {
    const next = pendingFields;
    pendingFields = null;
    updateRecord(next);
  }
}

export async function trackPage(page) {
  await updateRecord({ current_page: page });
}

export function startHeartbeat() {
  const beat = () => updateRecord({});
  const interval = setInterval(beat, 20000);
  const onUnload = () => {
    if (recordId) {
      try {
        base44.entities.VisitorSession.update(recordId, {
          is_active: false,
          last_seen: new Date().toISOString(),
        });
      } catch {}
    }
  };
  window.addEventListener("beforeunload", onUnload);
  return () => {
    clearInterval(interval);
    window.removeEventListener("beforeunload", onUnload);
  };
}