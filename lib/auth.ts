import { store, persistor } from "@/store/store"
import { removeRefreshTokenCookie } from "@/lib/cookies"
import { revertAll } from "@/store/slice/resetStore"
import { ROUTES } from "@/constants/routes"
import { toast } from "sonner"
import { resetLogoutGuard } from "@/lib/auth/tokenManager"
import { clearCurrentSession } from "@/lib/sessions/currentSession"
import { clearAuthSessionId } from "@/lib/sessions/clientDevice"

export type LogoutOptions = {
  reason?: "expired" | "manual"
  /** Skip the default logout toast (e.g. account already deleted). */
  silent?: boolean
}

export const logout = async (options?: LogoutOptions) => {
  const reason = options?.reason ?? "manual"
  const userId = store.getState().user?.user?.id

  store.dispatch(revertAll())
  await persistor.purge()
  await removeRefreshTokenCookie()
  if (userId) {
    clearCurrentSession(String(userId))
    clearAuthSessionId(String(userId))
  }

  if (!options?.silent) {
    if (reason === "expired") {
      toast.error("Your session has expired. Please log in again.")
    } else {
      toast.success("Logged out successfully")
    }
  }

  resetLogoutGuard()
  window.location.href = ROUTES.AUTH.LOGIN
}

export const isAuthenticated = (): boolean => {
  const state = store.getState()
  return state.auth?.isAuthenticated && state.user?.isAuthenticated
}

export const getCurrentUser = () => {
  const state = store.getState()
  return state.user?.user
}

export const getAccessToken = () => {
  const state = store.getState()
  return state.auth?.accessToken
}
