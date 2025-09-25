import { store, persistor } from "@/store/store";
import { removeRefreshTokenCookie } from "@/lib/cookies";
import { revertAll } from "@/store/slice/resetStore";

export const logout = () => {
  // Clear all auth data from Redux store
  store.dispatch(revertAll());

  // Clear persisted state
  persistor.purge();

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
