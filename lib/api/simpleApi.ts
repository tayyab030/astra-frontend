import axios from "axios";
import type { Store } from "@reduxjs/toolkit";
import { setAccessToken } from "@/store/slice/authSlice";
import { getRefreshTokenCookie } from "@/lib/cookies";
import { AUTH } from ".";
import { getAccessToken, logout } from "../auth";

let store: Store;

// allow us to inject redux store later
export const injectStore = (_store: Store) => {
  store = _store;
};

const baseURL = "http://127.0.0.1:8000";

export const publicApi = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Enable cookies
});

export const authApi = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Enable cookies
});

// request interceptor → verify token and add access token
authApi.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();

    if (!token) {
      console.error("No token found");
      return Promise.reject(new Error("No access token available"));
    }

    // Skip verification for token verification and refresh endpoints
    if (config.url?.includes("/verify/") || config.url?.includes("/refresh/")) {
      config.headers["authorization"] = `JWT ${token}`;
      return config;
    }

    try {
      // Verify token validity first
      await publicApi.post(AUTH.VERIFY_TOKEN, { token });

      // Token is valid, proceed with the request
      config.headers["authorization"] = `JWT ${token}`;
      return config;
    } catch (verifyError) {
      debugger;
      // Token verification failed, try to refresh
      const refreshToken = await getRefreshTokenCookie();

      if (!refreshToken) {
        console.error("No refresh token available");
        logout();
        return Promise.reject(new Error("No refresh token available"));
      }

      try {
        // Attempt to refresh the token
        const res = await publicApi.post(AUTH.REFRESH_ACCESS_TOKEN, {
          refresh: refreshToken,
        });

        const newAccessToken = res?.data?.access;
        if (newAccessToken) {
          store.dispatch(setAccessToken(newAccessToken));
          config.headers["authorization"] = `JWT ${newAccessToken}`;
          return config;
        } else {
          throw new Error("No access token in refresh response");
        }
      } catch (refreshError) {
        // Refresh failed, clear all auth data
        console.error("Token refresh failed:", refreshError);
        // logout();
        return Promise.reject(new Error("Token refresh failed"));
      }
    }
  },
  (error) => Promise.reject(error)
);

// response interceptor → handle unexpected 401 errors
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors that weren't already handled by request interceptor
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.error(
        "Unexpected 401 error - token may have expired during request"
      );
      logout();
    }

    return Promise.reject(error);
  }
);
