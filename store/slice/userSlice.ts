import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { revertAll } from "./resetStore";
import type { AppTheme } from "@/lib/theme";
import type { AiVoice } from "@/lib/ai-voice";
import type { AiDataScope, AiPersonality } from "@/lib/ai-settings";
import type { AiLanguage } from "@/lib/ai-language";
import type { ModuleSettings } from "@/lib/module-settings";

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
  theme?: AppTheme;
  ai_voice?: AiVoice;
  ai_voice_mode?: boolean;
  ai_personality?: AiPersonality;
  ai_insights?: boolean;
  ai_data_scope?: AiDataScope;
  ai_language?: AiLanguage;
  module_settings?: ModuleSettings;
  is_verified?: boolean;
  /** ISO signup date from the API. */
  created_at?: string | null;
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
