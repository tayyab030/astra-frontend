import axios from "axios";
import type { Store } from "@reduxjs/toolkit";
// import { setToken, clearToken } from "@/store/slice/authSlice"; // your slice

let store: Store;

// allow us to inject redux store later
export const injectStore = (_store: Store) => {
  store = _store;
};

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/";

export const publicApi = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export const authApi = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
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
// authApi.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     const state: any = store?.getState();
//     const refreshToken = state?.auth?.refreshToken;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const res = await publicApi.post("/auth/jwt/refresh/", { refresh: refreshToken });

//         const newAccessToken = res.data.access;
//         store.dispatch(setToken(newAccessToken));

//         // retry with new token
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return authApi(originalRequest);
//       } catch (err) {
//         store.dispatch(clearToken());
//       }
//     }

//     return Promise.reject(error);
//   }
// );
