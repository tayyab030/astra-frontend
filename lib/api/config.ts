const LOCAL_API_BASE_URL = "http://localhost:3001/api";
const LIVE_API_BASE_URL = "https://astra-backend-48lg.onrender.com/api";

function isLocalMode() {
  const mode = process.env.NEXT_PUBLIC_MODE?.toLowerCase();
  return mode === "local" || mode === "localhost" || mode === "development";
}

export function getApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  return isLocalMode() ? LOCAL_API_BASE_URL : LIVE_API_BASE_URL;
}
