"use client"

import { useEffect, useRef } from "react"
import { getRefreshTokenCookie } from "@/lib/cookies"
import { logoutSession, resolveAccessToken } from "@/lib/auth/tokenManager"
import { fetchCurrentUser } from "@/lib/api/user"
import { setCurrency } from "@/store/slice/currencySlice"
import { setUser } from "@/store/slice/userSlice"
import { useAppDispatch } from "@/store/hooks"

/**
 * Validates the session when the protected app shell mounts.
 * Loads the current user profile and syncs currency preference.
 * Logs the user out if both access and refresh tokens are invalid.
 */
export function useAuthSession() {
  const hasChecked = useRef(false)
  const dispatch = useAppDispatch()

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

      try {
        const user = await fetchCurrentUser()
        dispatch(setUser(user))
        if (user.currency) {
          dispatch(setCurrency(user.currency))
        }
      } catch {
        // Token may still be valid for other routes; profile can retry from Settings.
      }
    }

    void validateSession()
  }, [dispatch])
}
