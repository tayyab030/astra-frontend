import type { Store } from "@reduxjs/toolkit"
import { setAccessToken } from "@/store/slice/authSlice"
import { getRefreshTokenCookie } from "@/lib/cookies"
import { publicApi } from "@/lib/api/simpleApiClient"
import { API_ENDPOINTS } from "@/lib/api/endpoints"
import { getWebClientDeviceMeta } from "@/lib/sessions/clientDevice"

const { AUTH } = API_ENDPOINTS

let store: Store | undefined
let isLoggingOut = false

export function injectTokenStore(_store: Store) {
  store = _store
}

export function getAccessTokenFromStore() {
  return store?.getState().auth?.accessToken ?? null
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshTokenCookie()
  if (!refreshToken) return null

  try {
    const device = getWebClientDeviceMeta()
    const res = await publicApi.post(AUTH.REFRESH_ACCESS_TOKEN, {
      refresh: refreshToken,
      ...device,
    })
    const newAccessToken = res?.data?.access as string | undefined
    if (newAccessToken) {
      store?.dispatch(setAccessToken(newAccessToken))
      return newAccessToken
    }
  } catch (error) {
    console.error("Token refresh failed:", error)
  }

  return null
}

export async function verifyAccessToken(token: string): Promise<boolean> {
  try {
    await publicApi.post(AUTH.VERIFY_TOKEN, { token })
    return true
  } catch {
    return false
  }
}

/** Returns a valid access token, refreshing when needed. Null if session is dead. */
export async function resolveAccessToken(): Promise<string | null> {
  const existing = getAccessTokenFromStore()
  if (existing && (await verifyAccessToken(existing))) {
    return existing
  }
  return refreshAccessToken()
}

export async function logoutSession(reason: "expired" | "manual" = "expired") {
  if (isLoggingOut || typeof window === "undefined") return
  isLoggingOut = true

  try {
    const { logout } = await import("@/lib/auth")
    await logout({ reason })
  } catch (error) {
    console.error("Logout failed:", error)
    isLoggingOut = false
  }
}

export function resetLogoutGuard() {
  isLoggingOut = false
}
