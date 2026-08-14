"use client"

import { useEffect, useRef } from "react"
import { getRefreshTokenCookie } from "@/lib/cookies"
import { logoutSession, resolveAccessToken } from "@/lib/auth/tokenManager"

/**
 * Validates the session when the protected app shell mounts.
 * Logs the user out if both access and refresh tokens are invalid.
 */
export function useAuthSession() {
  const hasChecked = useRef(false)

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
      }
    }

    void validateSession()
  }, [])
}
