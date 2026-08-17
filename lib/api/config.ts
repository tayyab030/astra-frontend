const LOCAL_API_BASE_URL = "http://localhost:3001/api";
const LIVE_API_BASE_URL = "https://astra-backend-48lg.onrender.com/api";

/** True when NEXT_PUBLIC_MODE is local/localhost/development. */
export function isLocalMode() {
  const mode = process.env.NEXT_PUBLIC_MODE?.toLowerCase();
  return mode === "local" || mode === "localhost" || mode === "development";
}

/**
 * TEMPORARY_EMAIL_FLOW — revert marker (search: TEMPORARY_EMAIL_FLOW)
 *
 * Email UX (OTP verify, reset-link copy, delete confirmation email) is only
 * shown when NEXT_PUBLIC_MODE=local. Matches backend:
 * `process.env.MODE?.toLowerCase() === 'local'`.
 *
 * To restore email everywhere:
 * 1. Delete this helper.
 * 2. Remove every TEMPORARY_EMAIL_FLOW branch in the frontend.
 */
export function isEmailFlowEnabled(): boolean {
  return process.env.NEXT_PUBLIC_MODE?.toLowerCase() === "local";
}

export function getApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  return isLocalMode() ? LOCAL_API_BASE_URL : LIVE_API_BASE_URL;
}
