import { store } from "@/store/store";
// import { clearAuth } from "@/store/slice/authSlice";
// import { clearUser } from "@/store/slice/userSlice";
import { removeRefreshTokenCookie } from "@/lib/cookies";
import { revertAll } from "@/store/slice/resetStore";

export const logout = () => {
  // Clear all auth data from Redux store
  //   store.dispatch(clearAuth());
  //   store.dispatch(clearUser());
  store.dispatch(revertAll());

  // Remove refresh token from cookie
  removeRefreshTokenCookie();
};

export const isAuthenticated = (): boolean => {
  const state = store.getState();
  return state.auth.isAuthenticated && state.user.isAuthenticated;
};

export const getCurrentUser = () => {
  const state = store.getState();
  return state.user.user;
};

export const getAccessToken = () => {
  const state = store.getState();
  return state.auth.accessToken;
};
