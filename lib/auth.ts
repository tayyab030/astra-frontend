import { store, persistor } from "@/store/store"
import { removeRefreshTokenCookie } from "@/lib/cookies"
import { revertAll } from "@/store/slice/resetStore"
import { ROUTES } from "@/constants/routes"
import { toast } from "sonner"
import { resetLogoutGuard } from "@/lib/auth/tokenManager"

export type LogoutOptions = {
  reason?: "expired" | "manual"
}

export const logout = async (options?: LogoutOptions) => {
  const reason = options?.reason ?? "manual"

  store.dispatch(revertAll())
  await persistor.purge()
  await removeRefreshTokenCookie()

  if (reason === "expired") {
    toast.error("Your session has expired. Please log in again.")
  } else {
    toast.success("Logged out successfully")
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
