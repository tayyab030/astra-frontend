import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
