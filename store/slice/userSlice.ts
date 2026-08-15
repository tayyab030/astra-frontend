import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { revertAll } from "./resetStore";

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say" | null;
  currency?: string;
  country?: string | null;
  timezone?: string;
  theme?: "light" | "dark" | "neon";
  ai_voice?: "austin" | "daniel" | "troy" | "autumn" | "diana" | "hannah";
  ai_voice_mode?: boolean;
  ai_personality?: "professional" | "casual" | "motivational";
  ai_insights?: boolean;
  ai_data_scope?: "tasks" | "productivity" | "all";
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
