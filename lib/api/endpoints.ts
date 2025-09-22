// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    // LOGIN: "/auth/login",
    REGISTER: "/api/auth/users/",
    OTP_STATUS: (token: string) => `/api/otp/${token}/status/`,
    RESEND_OTP: "/api/otp/create/",
    VERIFY_OTP: "/api/otp/verify/",
    // REFRESH_TOKEN: "/auth/refresh",
    // LOGOUT: "/auth/logout",
    // FORGOT_PASSWORD: "/auth/forgot-password",
    // RESET_PASSWORD: "/auth/reset-password",
  },

  // User endpoints
  USER: {
    // PROFILE: "/user/profile",
    // UPDATE_PROFILE: "/user/profile",
    // CHANGE_PASSWORD: "/user/change-password",
    // UPLOAD_AVATAR: "/user/avatar",
  },

  // Dashboard endpoints
  DASHBOARD: {
    // ANALYTICS: "/dashboard/analytics",
    // HEALTH_SCORE: "/dashboard/health-score",
    // GOALS: "/dashboard/goals",
    // TASKS: "/dashboard/tasks",
    // NOTES: "/dashboard/notes",
    // WEALTH: "/dashboard/wealth",
    // COMMUNICATION: "/dashboard/communication",
  },

  // Assistant endpoints
  ASSISTANT: {
    // CHAT: "/assistant/chat",
    // HISTORY: "/assistant/history",
    // CLEAR_HISTORY: "/assistant/clear-history",
  },

  // Settings endpoints
  SETTINGS: {
    // PREFERENCES: "/settings/preferences",
    // NOTIFICATIONS: "/settings/notifications",
    // PRIVACY: "/settings/privacy",
  },
} as const;
