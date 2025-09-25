import axios from "axios";
import type { Store } from "@reduxjs/toolkit";
import { setAccessToken, clearAuth } from "@/store/slice/authSlice";
import { clearUser } from "@/store/slice/userSlice";
import { getRefreshTokenCookie, removeRefreshTokenCookie } from "@/lib/cookies";
import { AUTH } from ".";

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

// request interceptor → add access token
authApi.interceptors.request.use(
  (config) => {
    const state: any = store?.getState();
    const token = state?.auth?.accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor → handle refresh
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = getRefreshTokenCookie();

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken
    ) {
      originalRequest._retry = true;

      try {
        const res = await publicApi.post(AUTH.REFRESH, {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        store.dispatch(setAccessToken(newAccessToken));

        // retry with new token
        originalRequest.headers.Authorization = `JWT ${newAccessToken}`;
        return authApi(originalRequest);
      } catch (err) {
        // Refresh failed, clear all auth data
        store.dispatch(clearAuth());
        store.dispatch(clearUser());
        removeRefreshTokenCookie();
      }
    }

    return Promise.reject(error);
  }
);
