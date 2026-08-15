"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { getRefreshTokenCookie } from "@/lib/cookies"
import { logoutSession, resolveAccessToken } from "@/lib/auth/tokenManager"
import { fetchCurrentUser } from "@/lib/api/user"
import { setCurrency } from "@/store/slice/currencySlice"
import { setUser } from "@/store/slice/userSlice"
import { useAppDispatch } from "@/store/hooks"
import { isAppTheme } from "@/lib/theme"
import { applyThemeClass } from "@/lib/apply-theme-class"
import { canApplyServerTheme, captureThemeSyncToken } from "@/lib/theme-sync"

/**
 * Validates the session when the protected app shell mounts.
 * Loads the current user profile and syncs currency/theme preferences.
 * Logs the user out if both access and refresh tokens are invalid.
 */
export function useAuthSession() {
  const hasChecked = useRef(false)
  const dispatch = useAppDispatch()
  const { setTheme } = useTheme()

  useEffect(() => {
    if (hasChecked.current) return
    hasChecked.current = true

    async function validateSession() {
      const refreshToken = await getRefreshTokenCookie()
      if (!refreshToken) {
        await logoutSession("expired")
        return
      }

      const accessToken = await resolveAccessToken()
      if (!accessToken) {
        await logoutSession("expired")
        return
      }

      const themeSyncToken = captureThemeSyncToken()

      try {
        const user = await fetchCurrentUser()
        dispatch(setUser(user))
        if (user.currency) {
          dispatch(setCurrency(user.currency))
        }
        // Skip if the user already picked a theme while this request was in flight.
        if (canApplyServerTheme(themeSyncToken) && isAppTheme(user.theme)) {
          setTheme(user.theme)
          applyThemeClass(user.theme)
        }
      } catch {
        // Token may still be valid for other routes; profile can retry from Settings.
      }
    }

    void validateSession()
  }, [dispatch, setTheme])
}
